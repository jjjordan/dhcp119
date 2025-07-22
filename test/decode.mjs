import { assert } from 'chai';
import option119 from '../docs/option119.js';

const encode = option119.encode,
      splitInput = option119.splitInput,
      toHex = option119.toHex,
      toCisco = option119.toCisco,
      toMikrotik = option119.toMikrotik,
      decode = option119.decode,
      readName = option119.readName,
      decodeSegment = option119.decodeSegment,
      fromMikrotik = option119.fromMikrotik,
      fromHex = option119.fromHex;

describe("decode", function () {
    let roundtrip_cases = [
        "google.com telegraph.co.uk",
        "mydomain.home users.mydomain.home remote.users.mydomain.home",
        "remote.users.mydomain.home users.mydomain.home mydomain.home",
        "services.myhome.me devices.myhome.me myhome.me something-else.com",
        "google.com 0.google.com 555.yahoo.com"
    ];

    it("properly decodes the result of encode (hex)", function () {
        roundtrip_cases.forEach(x => assert.equal(encodeDecodeHex(x), x));
    });

    it("properly decodes the result of encode (Mikrotik)", function () {
        roundtrip_cases.forEach(x => assert.equal(encodeDecodeMikrotik(x), x));
    });

    it("properly decodes the result of encode (Cisco)", function () {
        roundtrip_cases.forEach(x => assert.equal(encodeDecodeCisco(x), x));
    });

    it("decodes samples from the web", function () {
        
    });

    it("rejects bad inputs", function () {
        // Infinite loop
        assert.throws(() => decode([3, 99, 111, 109, 192, 0, 0]));

        // Forward reference
        assert.throws(() => decode([4, 116, 101, 115, 116, 192, 7, 3, 99, 111, 109, 0]));
        
        // No END marker
        assert.throws(() => decode([4, 116, 101, 115, 116, 3, 99, 111, 109]));
        
        // Read past end
        assert.throws(() => decode([3, 65, 66, 67, 4, 65, 66, 67]));
    });
});

describe("fromHex", function () {
    it("converts basic hex strings", function () {
        assert.deepEqual(fromHex("0001020304"), [0, 1, 2, 3, 4]);
        assert.deepEqual(fromHex(""), []);
        assert.deepEqual(fromHex("0f0FeE"), [15, 15, 238]);
    });
    
    it("converts cisco hex strings", function () {
        assert.deepEqual(fromHex("0a0b.0c0d.0e0f"), [10, 11, 12, 13, 14, 15]);
        assert.deepEqual(fromHex("0001.0203.04"), [0, 1, 2, 3, 4]);
        assert.deepEqual(fromHex("....00.....04"), [0, 4]);
    });
    
    it("throws when there are an odd number of digits", function () {
        assert.throws(() => fromHex("0"));
        assert.throws(() => fromHex("000"));
        assert.throws(() => fromHex("   00 00 0 00"));
        assert.throws(() => fromHex(".00.0.00"));
    });
});

describe("fromMikrotik", function () {
    it("handles string literals", function () {
        assert.equal(decode(fromMikrotik("0x02s'65'0x06'google'0x03'com'0x00")), "65.google.com");
    });

    it("handles decimal literals", function () {
        assert.equal(decode(fromMikrotik("0x01'65'0x06'google'0x03'com'0x00")), "A.google.com");
    });

    it("handles IP address literals", function () {
        assert.equal(decode(fromMikrotik("0x06'google'0x03'com'0x000579'97.104.111.111'0xC007")), "google.com yahoo.com");
    });
});

function encodeDecodeHex(domains) {
    return decode(fromHex(toHex(encode(splitInput(domains)))));
}

function encodeDecodeMikrotik(domains) {
    return decode(fromMikrotik(toMikrotik(encode(splitInput(domains)))));
}

function encodeDecodeCisco(domains) {
    return decode(fromHex(toCisco(encode(splitInput(domains)))));
}
