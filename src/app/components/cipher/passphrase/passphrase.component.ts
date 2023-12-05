import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PassphraseBody } from 'src/app/common/passphrase-body';
import { PassphraseService } from 'src/app/service/passphrase/passphrase.service';

@Component({
  selector: 'app-passphrase',
  templateUrl: './passphrase.component.html',
  styleUrls: ['./passphrase.component.css']
})
export class PassphraseComponent {
  showExplained = false;
  ppInput = new PassphraseBody("","");
  ppOutput = new PassphraseBody("","");

  passphraseForm = new FormGroup({
    message: new FormControl('',Validators.required),
    passphrase: new FormControl('',Validators.required)
  })

  constructor(private ppSvc: PassphraseService){}

  onSubmit(){
    let temp = this.passphraseForm.value as PassphraseBody;
    this.ppSvc.encrypt(temp);
  }

  encrypt(){
    let temp = this.passphraseForm.value as PassphraseBody;
    this.ppSvc.encrypt(temp);
  }

  decrypt(){
    let temp = this.passphraseForm.value as PassphraseBody;
    this.ppSvc.decrypt(temp);
  }

  showExplanation(flag: boolean){
    this.showExplained = flag;
  }
}
