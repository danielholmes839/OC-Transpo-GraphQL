import React, { Component } from 'react';

class Login extends Component {
    render() {
        return (
            <div class="row">
                <div class="bg-white w-25 p-3 shadow rounded">
                    <form class="form-signin">
                        <h1 class="h3 mb-3 font-weight-bold text-center">Login</h1>
                        
                        <div class="mb-3">
                            <label for="inputEmail" class="sr-only">Email address</label>
                            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" />
                        </div>

                        <div class="mb-3">
                            <label for="inputPassword" class="sr-only">Password</label>
                            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" />
                        </div>

                        <div class="mb-3">
                            <button class="btn btn-sm btn-primary btn-block font-weight-bold" type="submit">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;