import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private _user$ = new BehaviorSubject<any>(null);
  public user$ = this._user$.asObservable();
  public admin: boolean = false;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedIn.next(true);
      this._user$.next(JSON.parse(storedUser));
      this.isAdmin(JSON.parse(storedUser).user);
    }
  }

  isAdmin(user: any): boolean {
    if (user?.role === 'admin') {
      this.admin = true;
    }
    else {
      this.admin = false;
    }
    return this.admin;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this._user$.next(user);
    this.loggedIn.next(true);
    this.isAdmin(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this._user$.next(null);
    this.admin = false;
  }

}
