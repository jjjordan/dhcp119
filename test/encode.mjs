import { assert } from 'chai';
import option119 from '../docs/option119.js';

const splitInput = option119.splitInput,
      encode = option119.encode,
      toMikrotik = option119.toMikrotik,
      toHex = option119.toHex,
      toCisco = option119.toCisco;

describe("encode", function () {
    it("encodes one domain", function () {
        assert.deepEqual(encode(["com"]), explode([3, "com", 0]));
        assert.deepEqual(encode(["google.com"]), explode([6, "google", 3, "com", 0]));
        assert.deepEqual(encode(["news.google.com"]), explode([4, "news", 6, "google", 3, "com", 0]));
    });
    
    it("encodes two unrelated domains", function () {
        assert.deepEqual(encode(["google.com", "telegraph.co.uk"]), explode([6, "google", 3, "com", 0, 9, "telegraph", 2, "co", 2, "uk", 0]));
    });
    
    it("properly creates back pointers", function () {
        assert.deepEqual(
            encode(["mydomain.home", "users.mydomain.home", "remote.users.mydomain.home"]),
            explode([8, "mydomain", 4, "home", 0, 5, "users", 192, 0, 6, "remote", 192, 15]));
        assert.deepEqual(
            encode(["remote.users.mydomain.home", "users.mydomain.home", "mydomain.home"]),
            explode([6, "remote", 5, "users", 8, "mydomain", 4, "home", 0, 192, 7, 192, 13]));
        assert.deepEqual(
            encode(["services.myhome.me", "devices.myhome.me", "myhome.me", "something-else.com"]),
            explode([8, "services", 6, "myhome", 2, "me", 0, 7, "devices", 192, 9, 192, 9, 14, "something-else", 3, "com", 0]));
    });
    
    it("properly handles spurious dots", function () {
        assert.deepEqual(
            encode(["google.com."]),
            explode([6, "google", 3, "com", 0]));
        assert.deepEqual(
            encode(["google.com.", "yahoo.com"]),
            explode([6, "google", 3, "com", 0, 5, "yahoo", 192, 7]));
        assert.deepEqual(
            encode(["google.com", "yahoo.com."]),
            explode([6, "google", 3, "com", 0, 5, "yahoo", 192, 7]));
    });
});

describe("splitInput", function () {
    it("returns one domain when one is present", function () {
        assert.deepEqual(splitInput("google.com"), ["google.com"]);
        assert.deepEqual(splitInput(" google.com"), ["google.com"])
        assert.deepEqual(splitInput("google.com "), ["google.com"])
        assert.deepEqual(splitInput(" google.com   "), ["google.com"])
    });
    
    it("returns two domains", function () {
        assert.deepEqual(splitInput("google.com yahoo.com"), ["google.com", "yahoo.com"]);
        assert.deepEqual(splitInput(" google.com   yahoo.com"), ["google.com", "yahoo.com"]);
        assert.deepEqual(splitInput("google.com  yahoo.com  "), ["google.com", "yahoo.com"]);
        assert.deepEqual(splitInput("       google.com         yahoo.com      "), ["google.com", "yahoo.com"]);
    });
});

describe("toMikrotik", function () {
    it("encodes correctly", function () {
        assert.deepEqual(
            toMikrotik(encode(["google.com", "yahoo.com"])),
            "0x06'google'0x03'com'0x0005'yahoo'0xC007");
    });

    it("properly handles numeric subdomains", function () {
        assert.deepEqual(
            toMikrotik(encode(["0.google.com"])),
            "0x01s'0'0x06'google'0x03'com'0x00");
        assert.deepEqual(
            toMikrotik(encode(["555.google.com"])),
            "0x03s'555'0x06'google'0x03'com'0x00");
    });
});

// Helper for writing expected arrays
function explode(ar) {
    let result = [];
    ar.forEach(el => {
        if (typeof el === 'string') {
            Array.from(el, c => result.push(c));
        } else if (typeof el === 'number') {
            result.push(el);
        } else {
            throw "Invalid element";
        }
    });
    
    return result;
}
