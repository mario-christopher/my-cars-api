export const addModelValidations = () => {
    StringValidations();
    NumberValidations();
}

const StringValidations = () => {

    String.prototype.min = function (n) {
        if (this.length < n)
            throw new Error(`Should contain a minimum of ${n} chars.`);
        else
            return this;
    }

    String.prototype.max = function (n) {
        if (this.length > n)
            throw new Error(`Should contain a maximum of ${n} chars.`);
        else
            return this;
    }

    String.prototype.password = function () {
        let exp = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');        // Atleast 1 uppercase, 1 lowercase, 1 numeric and min 8 chars long
        if (!exp.test(this))
            throw new Error(`Invalid password.`);
        else
            return this;
    }

    String.prototype.emailId = function () {
        let exp = RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
        if (!exp.test(this))
            throw new Error(`Invalid emailId.`);
        else
            return this;
    }

    String.prototype.required = function () {
        if (!this || this.length == 0)
            throw new Error(`This is a required field`);
        else
            return this;
    }
}

const NumberValidations = () => {

    Number.prototype.min = function (n) {
        if (this < n)
            throw new Error(`Should be a minimum of ${n}.`);
        else
            return this;
    }

    Number.prototype.max = function (n) {
        if (this > n)
            throw new Error(`Should be a maximum of ${n}.`);
        else
            return this;
    }

    Number.prototype.range = function (min, max) {
        if (this < min || this > max)
            throw new Error(`Should be within a range of ${min} and ${max}.`);
        else
            return this;
    }

    Number.prototype.required = function () {
        if (!this)
            throw new Error(`This is a required field`);
        else
            return this;
    }    
}