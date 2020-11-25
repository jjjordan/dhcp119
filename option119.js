
// option119.js - DHCP Option 119 encoder
// Copyright (C) 2020 John J. Jordan

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// ==============================================================================

// Encodes raw input (space-separated domain name list)
function encodeInput(s) {
    let parts = s.toLowerCase().split(" ").filter(function (p) { return p.length > 0; });
    if (parts.length > 0) {
        return encode(parts);
    } else {
        throw "Empty input";
    }
}

// Encodes an array of domain names
// The result is an array where each element is either a number (representing
// one byte) or a one-character string.
function encode(domains) {
    let refs = {};
    let result = [];

    for (let i = 0; i < domains.length; i++) {
        let domain = domains[i];
        for (let t = 0; t < domain.length; t++) {
            let subdomain = domain.substr(t);
            if (typeof refs[subdomain] === 'number') {
                let ptr = 0xC000 | refs[subdomain];
                result.push((ptr >> 8) & 0xff);
                result.push(ptr & 0xff);
                break;
            }

            refs[subdomain] = result.length;

            let dot = domain.indexOf(".", t);
            if (dot < 0) {
                dot = domain.length;
            }

            if (dot == t) {
                throw "Empty segment";
            }

            result.push(dot - t);
            for (; t < dot; t++) {
                result.push(domain.charAt(t));
            }
        }

        result.push(0);
    }

    return result;
}

// Encodes the result of encode() to Mikrotik RouterOS form.
function toMikrotik(encoded) {
    let result = [];

    for (let i = 0; i < encoded.length; ) {
        if (typeof encoded[i] == 'number') {
            result.push("0x");
            for (; typeof encoded[i] == 'number'; i++) {
                result.push(octetHex(encoded[i]));
            }
        } else if (typeof encoded[i] == 'string') {
            result.push("'");
            for (; typeof encoded[i] == 'string'; i++) {
                result.push(encoded[i]);
            }

            result.push("'");
        } else {
            // Try not to infinite loop.
            throw "Unexpected value in result";
        }
    }

    return result.join("");
}

// Converts one element from encode() to a hexadecimal string representing
// that byte.
function cvtHex(e) {
    if (typeof e == 'number') {
        return octetHex(e);
    } else if (typeof e == 'string') {
        return octetHex(e.charCodeAt(0));
    } else {
        throw "Unexpected value";
    }
}

// Converts a result from encode() to a hex string with optional separator.
function toHex(encoded, sep) {
    return encoded.map(cvtHex).join(sep || "");
}

// Converts a result from encode() to a string for Cisco IOS
function toCisco(encoded) {
    function cvtCisco(e, idx) {
        return (idx > 0 && idx % 2 == 0 ? "." : "") + cvtHex(e);
    }
    
    return encoded.map(cvtCisco).join("");
}

// Converts a number to a two-byte hex string.
function octetHex(n) {
    return ("0" + n.toString(16).toUpperCase()).slice(-2);
}

// Viewmodel for site layout.
var viewmodel = {
    input: ko.observable(),
    mikrotik: ko.observable(),
    cisco: ko.observable(),
    hex: ko.observable(),
    spacedHex: ko.observable(),
    error: ko.observable(),
    run: function () {
        try {
            this.clear();

            if (!this.input()) {
                return;
            }

            let result = encodeInput(this.input());
            this.mikrotik(toMikrotik(result));
            this.cisco(toCisco(result));
            this.hex(toHex(result));
            this.spacedHex(toHex(result, " "));
        } catch (e) {
            this.clear();
            this.error(e);
        }
    },
    clear: function() {
        [this.mikrotik, this.cisco, this.hex, this.spacedHex, this.error].forEach(function (f) { f(""); });
    },
    reset: function() {
        this.clear();
        this.input("");
    },
};
