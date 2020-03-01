const db = require('./../../firebaseAdmin').firestore()
const usersRef = db.collection('users')


/******************* GET ************************************/

async function getUserById(userId) {
    let p = new Promise((resolve, reject) => {
        usersRef.doc(userId).get()
            .then(doc => {
                if (doc.exists)
                    resolve(getObjectFromDoc(doc));
                else reject(new ObjectNotFoundError("No user with id=" + userId));

                return true;
            })
            .catch(err => {
                reject(new DbReadError(err.toString()));
            });
    });
    return p;
}

function funGetUsers(req, res) {
    let list = [];
    usersRef.get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                list.push(getObjectFromDoc(doc))
            })
            res.json(operationSuccess(list));
            return true;
        })
        .catch(err => {
            res.json(operationFail([
                new DbReadError(err.toString())]));
        });
}
function funGetUserById(req, res) {
    let userId = req.params.id
    getUserById(userId)
        .then(doc => {
            res.json(operationSuccess(doc));
            return true;
        })
        .catch(err => {
            res.json(operationFail([err]));
        });
}

function funGetTop(req, res) {
    let list = [];
    usersRef.where("type", "==", typeUser)
        .orderBy("rating", "desc")
        .get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                list.push(getObjectFromDoc(doc))
            })
            res.json(operationSuccess(list));
            return true;
        })
        .catch(err => {
            res.json(operationFail([
                new DbReadError(err.toString())]));
        });
}


/******************* POST ************************************/

function funCreateProfile(req, res) {
    let model = req.body;
    let userId = req.params.id;
    usersRef.doc(userId).set(model)
        .then(() => {
            res.send(operationSuccess({}));
            return true;
        })
        .catch(err => {
            res.json(operationFail([
                new DbWriteError(err.toString())]));
        });
}

function updateUserRating(userId, rating) {
    let p = new Promise(async (resolve, reject) => {

        let transaction = db.runTransaction(t => {
            return t.get(usersRef.doc(userId))
                .then(doc => {
                    let newRating = doc.data().rating + rating;
                    t.update(usersRef.doc(userId), { rating: newRating });
                    return true;
                });
        }).then(result => {
            resolve(true)
            return true;
        }).catch(err => {
            reject(new DbWriteError(err.toString()));
        });
    });
    return p;
}

async function funSetCompanyForUser(req, res) {
    let userEmails = req.body.userEmails;
    let companyId = req.body.companyId;
    try {
        let result = await setCompanyForUsers(userEmails, companyId);
        res.send(operationSuccess(result));
    }
    catch (err) {
        res.send(operationFail([new DbWriteError(err.toString())]));
    }
}
/******************* PUT ************************************/
async function funUpdateProfile(req, res) {
    let userId = req.params.id;
    let model = req.body;
    try {
        await usersRef.doc(userId).set(model);
        res.send(operationSuccess({}));
    }
    catch (err) {
        res.send(operationFail([
            new DbWriteError(err)
        ]));
    }
}

/******************* DELETE ************************************/

async function funDeleteUserById(req, res) {
    let userId = req.params.id;
    try {
        await usersRef.doc(userId).delete();
        res.send(operationSuccess({}));
    }
    catch (err) {
        res.send(operationFail([new DbWriteError(err.toString())]));
    }
}
function operationSuccess(datas) {
    const res = { "success": true, "errors": null }
    res.data = datas;
    return res;
}
function operationFail(errorsData) {
    const res = { "success": false, "data": null }
    if (errorsData) {
        res.errors = errorsData;
    }
    return res;
}

function getObjectFromDoc(doc) {
    let tmp = doc.data();
    tmp.id = doc.id;
    return tmp;
}

function validateUserModel(model) {
    let errorsList = [];
    if (isNullOrUndefined(model.firstName)) {
        errorsList.push(new NoParamError("firstName"))
    }
    if (isNullOrUndefined(model.lastName)) {
        errorsList.push(new NoParamError("lastName"))
    }
    return errorsList;
}

function DbReadError(message) {
    this.id = "DB_READ";
    this.message = message || 'Unknown error';
    this.stack = (new Error()).stack;
}
DbReadError.prototype = Object.create(Error.prototype);
DbReadError.prototype.constructor = DbReadError;
function DbWriteError(message) {
    this.id = "DB_WRITE";
    this.message = message || 'Unknown error';
    this.stack = (new Error()).stack;
}
DbWriteError.prototype = Object.create(Error.prototype);
DbWriteError.prototype.constructor = DbWriteError;

module.exports = {
    routes: {
        getUsers: funGetUsers,
        getUserById: funGetUserById,
        getTop: funGetTop,
        createProfile: funCreateProfile,
        setCompanyForUser: funSetCompanyForUser,
        deleteUserById: funDeleteUserById,
        updateProfile: funUpdateProfile,
    },
    updateUserRating
}