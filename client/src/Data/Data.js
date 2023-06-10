export var DataStruct = {};
export var contactmsg={};
export default function insertData(name, Displayname, password, img) {
    if (typeof (DataStruct[name]) !== 'undefined') {
        return false;

    }
    else {
        DataStruct[name] = { name: name, Displayname: Displayname, password: password, img: img ,allmsg:{},contacts:[],lastmsg:{}};
        return true;
    }


};