import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PassphraseBody } from 'src/app/common/cipher/passphrase-body';
import { PassphraseComponent } from 'src/app/components/cipher/passphrase/passphrase.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassphraseService {
  ppInput = new PassphraseBody("","");
  ppOutput = new PassphraseBody("","");
  private encryptUrl = environment.baseUrl+"/passphraseCipher/encrypt";
  private decryptUrl = environment.baseUrl+"/passphraseCipher/decrypt";

  constructor(private httpClient: HttpClient,
    private router: Router
    ) { }

  async encrypt(pp: PassphraseBody){
    this.httpClient.post<PassphraseBody>(this.encryptUrl, pp).subscribe(
      data=>{
        this.ppOutput = data as PassphraseBody;
        this.router.navigate(['/passphraseResult']);
      }
    )
  }

  async decrypt(pp: PassphraseBody){
    this.httpClient.post<PassphraseBody>(this.decryptUrl, pp).subscribe(
      data=>{
        this.ppOutput = data as PassphraseBody;
        this.router.navigate(['/passphraseResult']);
      }
    )
  }
}
