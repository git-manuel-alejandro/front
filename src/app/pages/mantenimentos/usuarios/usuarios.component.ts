import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0
  public usuarios: Usuario[] = []
  public usuariosTemp: Usuario[] = []


  public imgSubs: Subscription
  public desde: number = 0
  public cargando: boolean = true
  public mismoUsuario: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    public modalImagenService: ModalImagenService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarUsuarios()
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarUsuarios())


  }

  cargarUsuarios() {
    this.cargando = true
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios

      this.cargando = false

    })
  }

  cambiarPagina(valor: number) {
    this.desde += valor

    if (this.desde < 0) {
      this.desde = 0
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor
    }

    this.cargarUsuarios()
  }


  buscar(termino: string) {

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp
    } else {
      this.busquedaService.buscar('usuarios', termino).subscribe((resultados) => {
        this.usuarios = resultados
      })
    }
  }
  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      this.mismoUsuario = false
      Swal.fire(
        'No puede auto eliminarse',
        'Error',
        'error'
      )
      return
    }


    Swal.fire({
      title: 'Are you sure?',
      text: `Borrará el usuario ${usuario.email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        if (usuario.uid === this.usuarioService.uid) {
          this.mismoUsuario = false
          Swal.fire(
            'No puede auto eliminarse',
            'Error',
            'error'
          )
        } else {
          this.usuarioService.eliminarUsuario(usuario.uid).subscribe((res: any) => { })
          Swal.fire(
            'Usuario eliminado',
            `${usuario.email} eliminado`,
            'success'
          )

        }
        this.cargarUsuarios()

      }
    })
    this.usuarioService.eliminarUsuario(usuario.uid).subscribe((res) => {
      console.log(res)
    })
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp)
    })

  }

  abrirModal(usuario: Usuario) {
    console.log(usuario)
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img)
  }



}
