import { Component } from '@angular/core';
import { Service } from 'src/app/service/AppService';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Produto } from 'src/app/models/Produto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProjetoAngular';
  tokenUsser: string = "";

  displayedColumns: string[] = ['Id', 'Nome'];
  dataSource: any;

  profileFormRemove: FormGroup<{ id: FormControl<string | null>; }>;
  deleteRangeForm: FormGroup<{ ids: FormControl<string | null>; }>;
  profileFormUpdate: FormGroup<{id: FormControl<string | null>;
                                nome: FormControl<string | null>;
                                imagem: FormControl<string | null>;
                                }>;

  constructor(public AppService: Service, private formBuilder: FormBuilder) {
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

    // this. updateForm = this.formBuilder.group({
    //   id: ['', Validators.required],
    // });
  }
  
  get nossoToken(): string {
    return this.AppService.getToken();
  }

  profileForm = new FormGroup({
    nome: new FormControl('', Validators.required),
  });

 
  // ngOnInit() {
  //  this.GerarToken();
  // }


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


  // GerarToken() {
  //   this.AppService.GerarToken().toPromise().then((res) => {
  //     debugger
  //     this.tokenUsser = res;
  //     this.Listar();
  //   })
  //}

  // async GerarToken() {
  //   try {
  //     this.AppService.GerarToken().subscribe(res => {
  //         this.tokenUsser = res;
  //         debugger
  //       this.Listar();
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }


  // Listar() {
  //   this.AppService.ListaProdutos(this.tokenUsser)
  //     .toPromise()
  //     .then((produtos) => {
  //       var listaDeProdutos: any;
  //       listaDeProdutos = produtos;
  //       debugger
  //       this.dataSource = listaDeProdutos;
  //     })
  //     .catch((err) => {

  //       debugger
  //       var erros = err;
  //     });
  // }

  // CadastrarProdutos(nome: any) {

  //   var produto =
  //   {
  //     Id: 0,
  //     Nome: nome,
  //     Imagem: ""
  //   };

  //   this.AppService.InsereProduto(produto, this.tokenUsser)
  //     .toPromise()
  //     .then((okk) => {
  //       var ok = okk;
  //       this.Listar();
  //       this.limpaCampos();
  //     })
  //     .catch((err) => {
  //       debugger
  //       var erros = err;
  //     });

  // }

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

    // const produto : Produto = {
    //   Id: (id && !isNaN(parseInt(id))) ? parseInt(id) : 0,
    //   Nome: this.profileFormUpdate.value['nome'] || '',
    //   Imagem: this.profileFormUpdate.value['imagem'] || ''
    // };

    this.AppService.AtualizaProduto(produto, id ? parseInt(id) : 0, this.nossoToken)
        .toPromise()
        .then((ok) => {
            this.Listar();
            this.limpaCampos();
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
        this.limpaCampos();
      })
      .catch((err) => {
        debugger
        var erros = err;
      });

  }

  DeletaProdutos(ids: any[]) {
    const idList = ids.map(id => parseInt(id)); // Certifique-se que os IDs estão no formato correto para o backend
    this.AppService.DeleteRange(idList, this.nossoToken)
      .toPromise()
      .then(() => {
        this.Listar();
        this.limpaCampos();
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


}