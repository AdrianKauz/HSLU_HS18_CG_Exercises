export function KeyPressManager() {
    let keyMap = new Map();

    document.addEventListener('keydown', (event) => {
        if(keyMap.has(event.key)) {
            keyMap.set(event.key, true);
        }
    });

    document.addEventListener('keyup', (event) => {
        if(keyMap.has(event.key)) {
            keyMap.set(event.key, false);
        }
    });


    this.beginListening = function() {
        for(let x = 0; x < arguments.length; x++) {
            if(Object.prototype.toString.call(arguments[x]) === "[object String]") {
                keyMap.set(arguments[x], false);
            }
        }
    };


    this.isPressed = function(newKey) {
        if(keyMap.has(newKey)) {
            return keyMap.get(newKey);
        }

        return null;
    }
}