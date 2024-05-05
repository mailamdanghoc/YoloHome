//util class for pure custom error table, should return a new instance whenever props are modified
class formError {
    private errorList: {
        name: string,
        messages: string [],
        status: number
    } [];

    public constructor() {
        this.errorList = [];
    }

    public addError = (name: string, messages: string []): formError => {
        const newError = new formError();
        //check if error exist
        const error = this.errorList.find(e => e.name === name);
        if (!error) {
            newError.errorList = this.errorList.concat([{name: name, messages: messages, status: 0}]);
            return newError
        }
        else {
        //overide if exist
            newError.errorList = this.errorList.map(e => {
                if (e.name === name) return {name: name, messages: messages, status: 0};
                else return e; 
            })
            return newError;
        }
    }

    public setErrorStatus = (name: string, status: number): formError => {
        const error = this.errorList.find(e => e.name === name);
        if(!error) return this;
        else {
            if(status > error.messages.length + 1) return this;
            else {
                const newError = new formError();
                newError.errorList = this.errorList.map(e => {
                    if(e.name === name) return {name: e.name, messages: e.messages, status: status};
                    else return e;
                })
                return newError;
            }
        }
    }

    public setError = (name: string, msg: string): formError => {
        const error = this.errorList.find(e => e.name === name);
        if(!error) return this;
        else {
            const index = error.messages.indexOf(msg);
            if(index === -1) return this;
            else {
                const newError = new formError();
                newError.errorList = this.errorList.map(e => {
                    if(e.name === name) return {name: e.name, messages: e.messages, status: index + 1}
                    else return e;
                })
                return newError;
            }
        }
    }

    public clear = (): formError => {
        const newError = new formError();
        newError.errorList = this.errorList.map(e => {return {name: e.name, messages: e.messages, status: 0}});
        return newError;
    }

    public currentExist = (): string | undefined => {
        const ele = this.errorList.find(ele => (ele.status != 0 && ele.messages[ele.status - 1] != "match"));
        return ele ? ele.name : undefined;
    }

    public isExist = (name: string): boolean => {
        const ele = this.errorList.find(ele => ele.name === name);
        return ele?.status !== 0 ? true : false;
    }

    public toString = (name: string): string => {
        const error = this.errorList.find(e => e.name === name)
        if(!error) return "";
        else return error.status === 0 ? "" : error.messages[error.status - 1];
    }
   
}

export default formError;