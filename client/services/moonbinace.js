const CryptoJS = require("crypto-js");
let moonBNBPayload = {
    u: async function (idGame) {
        const timestamp = Date.now();
        console.log(timestamp)
        const numbers = [1, 2, 3, 4, 5];
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        let c = timestamp + "|305.402|248.560|0.194|278.596|384.950|1|70|77;" + timestamp + "|365.051|245.868|-0.301|385.480|311.775|1|50|99;" + timestamp + "|241.912|219.725|0.794|135.634|324.158|1|50|175;" + timestamp + "|401.458|230.310|-0.637|469.229|321.978|1|30|162;" + timestamp + "|325.721|250.461|0.026|320.484|449.392|1|30|170;" + timestamp + "|314.546|249.779|0.118|268.680|636.065|0|50|162;" + timestamp + "|415.082|220.459|-0.784|537.955|343.659|1|30|106;" + timestamp + "|310.079|249.258|0.155|252.286|618.766|1|70|149;" + timestamp + "|381.761|244.404|-0.448|0|0|0|37|42"
        // let a = "2d738e00de7b6b73139d2dbc422bb651"
        for (let i = 0; i < randomNumber; i++) {
            c = c + ";" + c
        }
        const iv = "2I0w0xZMtxHwH9yQ"
        const encrypted = CryptoJS.AES.encrypt(c, CryptoJS.enc.Utf8.parse(idGame), {
            iv: CryptoJS.enc.Utf8.parse(iv)
        });
        console.log("".concat(iv).concat(encrypted.ciphertext.toString(CryptoJS.enc.Base64)));
        return "".concat(iv).concat(encrypted.ciphertext.toString(CryptoJS.enc.Base64));
    }

}
module.exports = moonBNBPayload