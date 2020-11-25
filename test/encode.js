const option119 = require("../docs/option119");
const assert = require("chai").assert;

const encodeInput = option119.encodeInput,
      encode = option119.encode,
      toMikrotik = option119.toMikrotik,
      toHex = option119.toHex,
      toCisco = option119.toCisco;

describe("encode", function () {
    it("encodes one domain", function() {
        assert.deepEqual(encode(["google.com"]), [6, 'g', 'o', 'o', 'g', 'l', 'e', 3, 'c', 'o', 'm', 0]);
    });
});
