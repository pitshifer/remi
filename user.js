
const User = function(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.name = this.firstName + ' ' + this.lastName;
};

exports.User = User;
