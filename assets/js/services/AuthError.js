function AuthError(message) {
  this.name = 'Authentication Failed';
  this.message = message || 'Authentication Failure';
  this.stack = (new Error()).stack;
}

AuthError.prototype = Object.create(Error.prototype);
AuthError.prototype.constructor = AuthError;
export default AuthError;
