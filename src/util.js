export const formatViews = function(n) {
    let res,unit;
    if (n >= 1000000) {
        res = n/1000000;
        unit = "M";
    }
    else if (n >= 1000) {
        res = n/1000;
        unit = "K";
    }
    else {
        res = n;
        unit = "";
    }
    res = Math.floor(res * 10);
    if (res < 100 && res % 10 != 0) return (res/10) + unit;
    else return Math.floor(res/10) + unit;
};
//todo formatFollowerCount
export const formatTimeElapsed = function(tm) {
    let secs = Math.floor(Date.now()/1000) - tm;
    let res = "",num = 0;
    if (secs >= 31536000) {
        num = Math.floor(secs / 31536000);
        res = num + " year";
    }
    else if (secs >= 2592000) {
        num = Math.floor(secs / 2592000);
        res = num + " month";
    }
    else if (secs >= 86400) {
        num = Math.floor(secs / 86400);
        res = num + " day";
    }
    else if (secs >= 3600) {
        num = Math.floor(secs / 3600);
        res = num + " hour";
    }
    else if (secs >= 60) {
        num = Math.floor(secs / 60);
        res = num + " minute";
    }
    else {
        num = secs;
        res = num + " second";
    }
    return res + (num==1?"":"s") + " ago";
};