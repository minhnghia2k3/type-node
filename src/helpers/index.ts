// authentication helper ( encrypt password, create random token )
import crypto from "crypto"

const SECRET = "MINHNGHIA2K3-REST-API"

// RETURN a Buffer ( 128 bytes ) and convert to string `base64` with encode
export const random = () => crypto.randomBytes(128).toString("base64")

// Hmac (Hash-based Message Authentication Code): Mã xác thực tin nhắn dựa trên hàm băm
// sha256 (Secure hash algorithm 256 bit): Thuật toán băm bảo mật 256 bit
// RETURN hexadecimal string
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac("sha256", [salt, password].join('/')).update(SECRET).digest('hex');
}