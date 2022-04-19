let btn = document.getElementById('connectBut')
    var port, textEncoder, writableStreamClosed, writer;

//     async function connectSerial() {
console.log("test....")
console.log("test2....")
btn.onclick = async () => {
   
        try {
            // Prompt user to select any serial port.
//              device = await navigator.usb.requestDevice({
//                 filters: [{vendorId: 0x67B},{vendorId: 0x0C45}]
//               });
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });
            listenToPort();

            textEncoder = new TextEncoderStream();
            writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

            writer = textEncoder.writable.getWriter();
        } catch {
            alert("Serial Connection Failed");
        }
    }

    async function sendCharacterNumber(){
       document.getElementById("lineToSend").value = String.fromCharCode(document.getElementById("lineToSend").value);
    }
   
    async function sendSerialLine() {
//         dataToSend = document.getElementById("lineToSend").value;
//         if (document.getElementById("addLine").checked == true) dataToSend = dataToSend + "\r\n";
//         if (document.getElementById("echoOn").checked == true) appendToTerminal("> " + dataToSend);
        dataToSend = 'AT'
        dataToSend = dataToSend + "\r\n";
        appendToTerminal("> " + dataToSend);
        await writer.write(dataToSend);
//         document.getElementById("lineToSend").value = "";
//         //await writer.releaseLock();
    }

    async function listenToPort() {
        console.log("send...");
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        console.log("reader==",reader);
        // Listen to data coming from the serial device.
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Allow the serial port to be closed later.
                //reader.releaseLock();
                break;
            }
            // value is a string.
            appendToTerminal(value);
        }
    }

    const serialResultsDiv = document.getElementById("serialResults");

    async function appendToTerminal(newStuff) {
         console.log("newStuff==",newStuff);
        serialResultsDiv.innerHTML += newStuff;
        if (serialResultsDiv.innerHTML.length > 3000) serialResultsDiv.innerHTML = serialResultsDiv.innerHTML.slice(serialResultsDiv.innerHTML.length - 3000);

        //scroll down to bottom of div
        serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
    }

let send_btn = document.getElementById('lineToSend')
send_btn.onclick = async () => {
    sendSerialLine();
}
//     document.getElementById("lineToSend").addEventListener("keyup", async function (event) {
//         if (event.keyCode === 13) {
//             sendSerialLine();
//         }
//     })

//     document.getElementById("baud").value = (localStorage.baud == undefined ? 9600 : localStorage.baud);
//     document.getElementById("addLine").checked = (localStorage.addLine == "false" ? false : true);
//     document.getElementById("echoOn").checked = (localStorage.echoOn == "false" ? false : true);

