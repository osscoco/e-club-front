import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Url de l'Api Backend (dotnet)
  private apiUrl = environment.apiUrl + '/api/';

  // Constructeur
  constructor(private http: HttpClient) { }

  // ---------- AUTHENTIFICATION ---------- //

  // ----- ANONYMOUS ----- //

  // Connexion : Appel à l'Api Backend (dotnet)
  login(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'Auth/login', postData);
  }

  // Inscription : Appel à l'Api Backend (dotnet)
  register(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'User/create', postData);
  }

  // Récupération Utilisateur Existant : Appel à l'Api Backend (dotnet)
  getOneUserByEmail(email: any) {
    return this.http.get<any>(this.apiUrl + 'User/' + email); 
  }

  // Génération du TemporaryCodeResetPassword : Appel à l'Api Backend (dotnet)
  generateTemporaryCodeResetPassword(postData: any) {
    return this.http.post<any>(this.apiUrl + 'User/generateTemporaryCodeResetPassword', postData)
  }

  // Envoi d'email avec le TemporaryCodeResetPassword : Appel à l'Api Backend (dotnet)
  sendMailResetPassword(postData: any) {
    return this.http.post<any>(this.apiUrl + 'User/sendMailWithTemporaryCodeResetPassword', postData);
  }

  // Vérification du TemporaryCodeResetPassword lié à l'email : Appel à l'Api Backend (dotnet)
  verifyTemporaryCodeResetPasswordByMail(email: any, temporaryCode: any) {
    return this.http.get<any>(this.apiUrl + 'User/verifyTemporaryCodeResetPasswordByMail/' + email + '/' + temporaryCode);
  }

  // Mise à jour du Mot de passe lié à l'email : Appel à l'Api Backend (dotnet)
  setNewPassword(postData: any) {
    return this.http.post<any>(this.apiUrl + 'User/setNewPassword', postData);
  }

  // ----- AUTH ----- //

  // Récupération Utilisateur Connecté : Appel à l'Api Backend (dotnet)
  authMe(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.get<any>(this.apiUrl + 'Auth/getAuthMe', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Déconnexion : Appel à l'Api Backend (dotnet)
  logout(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.get<any>(this.apiUrl + 'Auth/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ---------- USER ---------- //

  // ----- AUTH ----- //

  // Récupération des utilisateurs : Appel à l'Api Backend (dotnet)
  getUsers(page: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.get<any>(this.apiUrl + 'User', {
      params: new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Modification : Appel à l'Api Backend (dotnet)
  updateProfil(userId: string, postData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.put<any>(this.apiUrl + 'User/' + userId, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Suppression : Appel à l'Api Backend (dotnet)
  deleteProfil(userId: string, postData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.post<any>(this.apiUrl + 'Auth/deleteAuthMe/' + userId, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ---------- CHOICES ---------- //
  
  // ----- ANONYMOUS ----- //

  // Récupération Choices Existants : Appel à l'Api Backend (dotnet)
  getChoices(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'Choice', {
    params: new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize)
    });
  }

  // ---------- SUBCHOICES ---------- //
  
  // ----- ANONYMOUS ----- //

  // Récupération SubChoices Existants : Appel à l'Api Backend (dotnet)
  getSubChoices(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'SubChoice', {
    params: new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize)
    });
  }

  // Récupération SubChoices Existants Depuis Utilisateur Existant : Appel à l'Api Backend (dotnet)
  getSubChoicesFromUserByEmail(mail: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Aucun token trouvé dans le localStorage');
      });
    }

    return this.http.get<any>(this.apiUrl + 'SubChoice/User/' + mail, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ---------- PROMOS ---------- //
  
  // ----- ANONYMOUS ----- //

  // Récupérer Promos Type CLIP : Appel à l'Api Backend (dotnet)
  getPromosClip(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'Promo/PromosClip', {
    params: new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize)
    });
  }

  // Récupérer Promos Type PROD : Appel à l'Api Backend (dotnet)
  getPromosProd(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'Promo/PromosProd', {
    params: new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize)
    });
  }  
}