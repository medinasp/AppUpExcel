import { Component } from '@angular/core';
import { Service } from 'src/app/service/AppService';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Produto } from 'src/app/models/Produto';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
//import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.componentform.html',
  styleUrls: ['./app.componentform.scss']
})
export class AppComponentForm {
  title = 'ProjetoAngular';
  tokenUsser: string = "";

  displayedColumns: string[] = ['Id', 'Nome', 'Imagem'];
  dataSource: any;

  profileFormRemove: FormGroup<{ id: FormControl<string | null>; }>;
  deleteRangeForm: FormGroup<{ ids: FormControl<string | null>; }>;
  profileFormUpdate: FormGroup<{id: FormControl<string | null>;
                                nome: FormControl<string | null>;
                                imagem: FormControl<string | null>;
                                }>;
  headers: string[] = [];
  results: any[] = [];
  showSendButton = false;
  dataToBeSent: any[] = [];
  previewData: any[] = [];

  resultsPreview: any[] = [];
  showExcelPreview = false;

  constructor(public AppService: Service, private formBuilder: FormBuilder, private router: Router) {
    this.profileFormRemove = new FormGroup({
      id: new FormControl('', Validators.required),
    });
  
    this.deleteRangeForm = this.formBuilder.group({
      ids: ['', Validators.required]
    });

    this.profileFormUpdate = this.formBuilder.group({
      id: new FormControl<string | null>(null),
      nome: new FormControl<string | null>(null),
      imagem: new FormControl<string | null>(null)
   
    });
  }
  
  get nossoToken(): string {
    return this.AppService.getToken();
  }

  profileForm = new FormGroup({
    nome: new FormControl('', Validators.required),
  });

 
  ngOnInit() {
      this.Listar();
  }


  onSubmit() {

    debugger

    console.warn(this.profileForm.value);

    var inputNome = this.profileForm.value["nome"];
    this.CadastrarProdutos(inputNome);
  }

  onUpdate() {
    const id = this.profileFormUpdate.value['id'];
    const nome= this.profileForm.value["nome"];
    const imagem = this.profileFormUpdate.value['imagem'];
const produto = {
  Id: (id && !isNaN(parseInt(id))) ? parseInt(id) : 0,
  Nome: this.profileFormUpdate.value['nome'] || '',
  Imagem: this.profileFormUpdate.value['imagem'] || ''
};
    this.AtualizarProduto(produto);
}

  onDelete() {

    debugger
    console.warn(this.profileFormRemove.value);
    const id = this.profileFormRemove.value['id'];
    this.RemoverProdutos(id);
}

onDeleteRange() {
  const deleteRangeForm = this.deleteRangeForm;
  if (deleteRangeForm) {
    const ids = deleteRangeForm.get('ids')?.value?.split(',');
    if (ids) {
      this.DeletaProdutos(ids);
    }
  }
}

onBackLogin()
{
  this.router.navigate(['./login']);
}

Listar() {
    this.AppService.ListaProdutos(this.nossoToken)
      .toPromise()
      .then((produtos) => {
        var listaDeProdutos: any;
        listaDeProdutos = produtos;
        debugger
        this.dataSource = listaDeProdutos;
      })
      .catch((err) => {

        debugger
        var erros = err;
      });
  }

  CadastrarProdutos(nome: any) {
    var produto =
    {
      Id: 0,
      Nome: nome,
      Imagem: ""
    };

    this.AppService.InsereProduto(produto, this.nossoToken)
      .toPromise()
      .then((okk) => {
        var ok = okk;
        this.Listar();
        this.limpaCampos();
      })
      .catch((err) => {
        debugger
        var erros = err;
      });

  }

  public AtualizarProduto(produto: Produto) {
    const id = this.profileFormUpdate.value['id'];
    const nome = this.profileForm.value["nome"];
    const imagem = this.profileFormUpdate.value['imagem'];

    this.AppService.AtualizaProduto(produto, id ? parseInt(id) : 0, this.nossoToken)
        .toPromise()
        .then((ok) => {
            this.Listar();
            this.profileFormUpdate.patchValue({
              id: '',
              nome: '',
              imagem: '',
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

    RemoverProdutos(id: any) {
    var produto =
    {
      Id: id,
      Nome: "",
      Imagem: ""
    };

    this.AppService.RemoveProduto(produto, this.nossoToken)
      .toPromise()
      .then((okk) => {
        var ok = okk;
        this.Listar();
        this.profileFormRemove.patchValue({
          id: '',
        });
      })
      .catch((err) => {
        debugger
        var erros = err;
      });

  }

  DeletaProdutos(ids: any[]) {
    const idList = ids.map(id => parseInt(id));
    this.AppService.DeleteRange(idList, this.nossoToken)
      .toPromise()
      .then(() => {
        this.Listar();
        this.deleteRangeForm.patchValue({
          ids: '',
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  limpaCampos() {
    this.profileForm.patchValue({
      nome: '',
    });
  }

  carregarTela() {
    this.profileForm.patchValue({
      nome: 'Teste Campo',
    });
  }

  // onFileSelected_(event: any) {
  //   debugger
  //   const file: File = event.target.files[0];
  //   const reader: FileReader = new FileReader();
  //   reader.readAsBinaryString(file);
  
  //   reader.onload = (e: any) => {
  //     /* read workbook */
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
  //     /* grab first sheet */
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
  //     /* generate JSON */
  //     const data: any[] = XLSX.utils.sheet_to_json(ws);
      
  //     /* send data to API backend */
  //     this.AppService.sendDataToBackend(data);
  //   };
  // }  

  handleFileInput(event: any) {
    this.onFileSelected(event);
    this.importExcel(event);
  }
  
  onFileSelected(event: any) {
    debugger
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
  
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
      /* generate JSON */
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
      /* transform data to array of objects */
      const headers: string[] = data.shift(); // remove headers from data array
      const result = data.map(row => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });
  
      /* set resultsPreview and showExcelPreview to true */
      this.resultsPreview = result;
      this.showExcelPreview = true;
  
      /* save data to be sent */
      this.dataToBeSent = result;
  
      /* set showSendButton to true */
      this.showSendButton = true;
    };
    debugger
    reader.readAsBinaryString(file);
  }

  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot upload multiple files on the entry');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.results = <any[]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.headers = this.results[0];
      this.results.splice(0, 1);
      this.showSendButton = true;
      this.dataToBeSent = [];
    };
    reader.readAsBinaryString(target.files[0]);
  }
  
  sendDataToBackend() {
    /* send data to API backend */
    this.AppService.sendDataToBackend(this.dataToBeSent).subscribe(() => {
      /* reset form and hide send button */
      this.dataToBeSent = [];
      this.showSendButton = false;
    });
  }
}