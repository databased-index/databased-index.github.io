/*
 * Author: Databasedgirl (Ana)
 * Github: https://github.com/databasedgirl
 * Website: https://databased-index.github.io
 * Twitter: @databasedbun
 */

/*
    Pre-Generate CRC Lookup Table
*/
let CRCTable = [];
let Polynomial = 0xEDB88320;

for (let i = 0; i < 256; i++) {
    let CRC = i;
    for (let j = 0; j < 8; j++) {
        if (CRC & 1) {
            CRC = (CRC >>> 1) ^ Polynomial;
        } else {
            CRC = CRC >>> 1;
        }
    }
    CRCTable[i] = CRC >>> 0;
}
/*
    LCG based seed generation
*/
function GenSeed() {
    let init = new Date().getMilliseconds() * Math.random();
    let X = init * 2;
    let m = ((init * 20) * 2003515245 + 401245991);
    let c = ((m * 5) * 510351524 + 901245991);
    let a = ((m * 9) * 903515245 + 6956825);
    return Math.abs((a * X + c) % m);
}
/*
    General CRC Calculation
*/
function CalcCRC(data) {
    let crc = 0xFFFFFFFF;
    data.forEach(byte => {
        let idx = (crc ^ byte) & 0xFF;
        crc = (crc >>> 8) ^ CRCTable[idx];
    });
    return (crc ^ 0xFFFFFFFF) >>> 0;
}
/*
    IHDR
    1) I,H,D,R
    2) WIDTH & HEIGHT
    3) Image definitions (Bit Depth, Color Type, Compression, Filter, Interlace)
    4) CRC
    5) IHDR length
    6) Concat IHDR data
    7) Separate CRC into its own bytes and push into IHDR
*/
function GenIHDR(width = 8, height = 8) {
    let IHDRData = [0x49, 0x48, 0x44, 0x52]; 
    IHDRData.push((width >>> 24) & 0xFF, (width >>> 16) & 0xFF, (width >>> 8) & 0xFF, width & 0xFF);
    IHDRData.push((height >>> 24) & 0xFF, (height >>> 16) & 0xFF, (height >>> 8) & 0xFF, height & 0xFF);

    IHDRData.push(0x08, 0x02, 0x00, 0x00, 0x00); 
    
    let crc = CalcCRC(IHDRData);
    
    let IHDR = [0x00, 0x00, 0x00, 0x0D]; 
    IHDRData.forEach(byte => IHDR.push(byte));
    
    IHDR.push((crc >> 24) & 0xFF, (crc >> 16) & 0xFF, (crc >> 8) & 0xFF, crc & 0xFF);
    
    return IHDR;
}
/*
    Generate pixels
*/
function GenPXLS(width,height,PixelRange,Filter,r,g,b,customRange) {
    
    let imageData = [];
    /**
     * 0   R   G   B
     * 0   R   G   B
     * 0   R   G   B
     * 0   R   G   B
     * 0   R   G   B
     * Filter , Color
     **
     */
    console.log(Filter)
    const UnbalPixels = [(GenSeed() % PixelRange).toFixed(),GenSeed() % PixelRange,PixelRange];
    for (let y = 0; y < height; y++) {
        imageData.push(Filter); 
        for (let x = 0; x < width; x++) {
            if(customRange){
                imageData.push(GenSeed() % r); // R
                imageData.push(GenSeed() % g); // G
                imageData.push(GenSeed() % b); // B
            }else{
                imageData.push((typeof(r) === "undefined")?GenSeed() % UnbalPixels[GenSeed().toFixed()%UnbalPixels.length]:r); // R
                imageData.push((typeof(g) === "undefined")?GenSeed() % UnbalPixels[GenSeed().toFixed()%UnbalPixels.length]:g); // G
                imageData.push((typeof(b) === "undefined")?GenSeed() % UnbalPixels[GenSeed().toFixed()%UnbalPixels.length]:b); // B
            }
            
        }
    }
    
    return new Uint8Array(imageData);
}
/*
    Compress image information
*/
async function Compressor(data) {
    const stream = new CompressionStream('deflate');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    writer.write(data);
    writer.close();
    
    const chunks = [];
    let done = false;
    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
    }
    
    return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
}
/*
    Generate IDAT chunks
    1) I,D,A,T
    2) Pull data from compressed IDAT and push its bytes into IDAT array
    3) Calculate CRC
    4) Build: Length + data + CRC
    5) push bytes from IDAT array to newly built arary
    6) Cut down CRC into its own bytes and push them into new array
*/
function GenIDAT(compressedData) {
    let IDATData = [0x49, 0x44, 0x41, 0x54]; 
    compressedData.forEach(byte => IDATData.push(byte));
    
    let crc = CalcCRC(IDATData);
    
    let length = compressedData.length;
    let IDAT = [
        (length >> 24) & 0xFF, (length >> 16) & 0xFF, 
        (length >> 8) & 0xFF, length & 0xFF
    ];
    
    IDATData.forEach(byte => IDAT.push(byte));
    IDAT.push((crc >> 24) & 0xFF, (crc >> 16) & 0xFF, (crc >> 8) & 0xFF, crc & 0xFF);
    return IDAT;
}

/*
    Convert array to base64
 */
function Arr2B64(bytes) {
    let Bin = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        Bin += String.fromCharCode.apply(null, chunk);
    }
    
    return btoa(Bin);
}

/*
    Main
    1) Set image width and height
    2) PNG signature
    3) Get generated IHDR
    4) Get generated pixels
    5) Throw pixels to compressor and get compressed data back
    6) Generate IDAT from compressed information
    7) IEND
    8) set concatenator array
    9) Push sig,ihdr,idat and iend to concatenator
    10) Conv concatenated info to b64
    11) Turn it into a valid image format
    12) Present image on html
*/
async function GenDefinitions(width = 500,height=500,PixelRange=1200,Filter=0,r,g,b,customRange=false) {
    const W = width;
    const H = height;
    console.log(PixelRange)
    const PNGSIG = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    
    const IHDR = GenIHDR(W, H);
    const Pixels = GenPXLS(W, H,PixelRange,Filter,r,g,b,customRange);
    const Compressed = await Compressor(Pixels);
    const IDAT = GenIDAT(Compressed);
    const IEND = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82];
    
    const IMG = [];
    PNGSIG.forEach(b => IMG.push(b));
    IHDR.forEach(b => IMG.push(b));
    IDAT.forEach(b => IMG.push(b));
    IEND.forEach(b => IMG.push(b));
    
    const b64 = Arr2B64(IMG);
    const dataURI = `data:image/png;base64,${b64}`;
    
    const containers = document.getElementsByClassName('img-gen');
    if (containers.length > 0) {
        containers[0].src = dataURI;
    } else {
        console.log(dataURI);
    }
    return dataURI;
}

window.onload = function() {
    GenDefinitions();
    let gennew = document.getElementsByClassName('genNew')[0];
    document.getElementsByClassName('img-gen')[0].addEventListener('click',(evt)=>{
        evt.preventDefault();
        window.open(document.getElementsByClassName('img-gen')[0].src);
        
    })
    gennew.addEventListener('click',()=>{
        let g1 = document.getElementsByClassName('gen1')[0].value || 500;
        let g2 = document.getElementsByClassName('gen2')[0].value || 500;
        let g3 = document.getElementsByClassName('gen3')[0].value || undefined;
        let g4 = document.getElementsByClassName('gen4')[0].value || 0;
        let g5 = document.getElementsByClassName('gen5')[0].value || undefined;
        let g6 = document.getElementsByClassName('gen6')[0].value || undefined;
        let g7 = document.getElementsByClassName('gen7')[0].value || undefined;
        if(g4 > 4){
            g4 = 4;
        }
        if(g4 < 0){
            g4 = 0;
        }
        let customRange = false;
        if(typeof(g3) !== "undefined"){
            customRange = true;
        }
        GenDefinitions(g1,g2,g3,g4,g5,g6,g7,customRange);
    })
};