var method = myFile.prototype;

function myFile(name,href,size) {
    this._name = name;
    this._href = href;
    this._size = size;
}

method.getName = function() {
    return this._name;
};

module.exports = myFile;