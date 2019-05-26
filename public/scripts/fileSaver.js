

document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    var algorithm =   {name: "AES-CBC", length: 256};


    document.getElementById("generate-key").addEventListener("click", generateKey);
    document.getElementById("encrypt").addEventListener("click", encryptFile);
    document.getElementById("decrypt").addEventListener("click", decryptFile);


    function generateKey() {

        window.crypto.subtle.generateKey(
          algorithm,
            true,
            ["encrypt", "decrypt"]

        ).then(function(encKey) {
            window.crypto.subtle.exportKey('raw', encKey

            ). then(function(encKeyBuffer) {
                document.getElementById("aes-key").value = arrayBufferToHexString(encKeyBuffer);

            }).catch(function(err) {
                alert("Key export failed: " + err.message);
            });

        }). catch(function(err) {
            alert("Key generation failed: " + err.message);
        });
    }

    function encryptFile() {

        var sourceFile = document.getElementById("source-file").files[0];

        var encKeyBytes = hexStringToByteArray(document.getElementById("aes-key").value);
        var encKey;
        var reader = new FileReader();

        reader.onload = function() {
            var iv = window.crypto.getRandomValues(new Uint8Array(16));
            window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv: iv},
                encKey,
                new Uint8Array(reader.result)

            ). then(function(result) {
                var blob = new Blob([iv, new Uint8Array(result)], {type: "application/octet-stream"});
                saveAs(blob, "Encrypted " + sourceFile.name);



            }). catch(function(err) {
                alert("Encryption failed: " + err.message);
            });
        };

        window.crypto.subtle.importKey(
            "raw",
            encKeyBytes,
            algorithm,
            true,
            ["encrypt", "decrypt"]

        ).then(function(importedKey) {
           encKey = importedKey;
            reader.readAsArrayBuffer(sourceFile);

        }).catch(function(err) {
            alert("Key import and file read failed: " + err.message);
        });
    }


    function decryptFile() {

        var sourceFile = document.getElementById("source-file").files[0];

        var encKeyBytes = hexStringToByteArray(document.getElementById("aes-key").value);
        var encKey;
        var reader = new FileReader();

        reader.onload = function() {
            var iv = new Uint8Array(reader.result.slice(0, 16));
            window.crypto.subtle.decrypt(
                {name: "AES-CBC", iv: iv},
                encKey,
                new Uint8Array(reader.result.slice(16))

            ).then(function(result) {
                var blob = new Blob([new Uint8Array(result)], {type: "application/octet-stream"});
                saveAs(blob, "Decrypted " + sourceFile.name);


            }).
            catch(function(err) {
                alert("Decryption failed: " + err.message);
            });
        };

        window.crypto.subtle.importKey(
            "raw",
            encKeyBytes,
            algorithm,
            true,
            ["encrypt", "decrypt"]

        ). then(function(importedKey) {
            encKey = importedKey;
            reader.readAsArrayBuffer(sourceFile);
        }).catch(function(err) {
            alert("Key import and file read failed: " + err.message);
        });
    }



    function arrayBufferToHexString(arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var hexString = "";
        var nextHexByte;

        for (var i=0; i<byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16);
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;
            }
            hexString += nextHexByte;
        }
        return hexString;
    }

    function hexStringToByteArray(hexString) {
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }

        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        return byteArray;
    }

});
