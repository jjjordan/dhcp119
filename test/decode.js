const option119 = require("../docs/option119");
const assert = require("chai").assert;

const encode = option119.encode,
      splitInput = option119.splitInput,
      toHex = option119.toHex,
      toCisco = option119.toCisco,
      decode = option119.decode,
      readName = option119.readName,
      decodeSegment = option119.decodeSegment,
      fromMikrotik = option119.fromMikrotik,
      fromHex = option119.fromHex;

function encodeDecodeHex(domains) {
    return decode(fromHex(toHex(encode(splitInput(domains)))));
}

describe("decode", function () {
    it("properly decodes the result of encode", function () {
        assert.equal(
            encodeDecodeHex("google.com telegraph.co.uk"),
            "google.com telegraph.co.uk");
        assert.equal(
            encodeDecodeHex("mydomain.home users.mydomain.home remote.users.mydomain.home"),
            "mydomain.home users.mydomain.home remote.users.mydomain.home");
        assert.equal(
            encodeDecodeHex("remote.users.mydomain.home users.mydomain.home mydomain.home"),
            "remote.users.mydomain.home users.mydomain.home mydomain.home");
        assert.equal(
            encodeDecodeHex("services.myhome.me devices.myhome.me myhome.me something-else.com"),
            "services.myhome.me devices.myhome.me myhome.me something-else.com");
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
});
