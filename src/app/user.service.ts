import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FrontEndConfig } from "./frontendConfig"
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  serverurl = this.frontEndConfig.getServerUrl();

  constructor(private http:HttpClient,private frontEndConfig:FrontEndConfig,private _snackBar: MatSnackBar) { 
  }

  // create New User
  createUser(userdata){
    return this.http.post(this.serverurl+'/api/users',userdata)
  }

// login with user credentials
  loginAuthentication(user){
    return this.http.post(this.serverurl + '/auth/local', user)
  }
  // get user Profile when Login
  getProfile(){
    return this.http.get(this.serverurl + '/api/users/me')

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  createTask(data){
    return this.http.post(this.serverurl + '/api/tasks',data)
  }
  getTasks(){
    return this.http.get(this.serverurl + '/api/tasks')
  }
  deleteTask(id){
    return this.http.delete(this.serverurl + '/api/tasks/'+id)
  }
  updateTask(id,data){
    return this.http.put(this.serverurl + '/api/tasks/'+id,data)
  }
}
