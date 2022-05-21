import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup
  public usuario: Usuario
  public imagenSubir: File
  public imgTemp: any = null

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {

    this.usuario = usuarioService.usuario
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    })
  }

  actualizarPerfil() {
    // console.log('hi')
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe((res: any) => {
      const { nombre, email } = this.perfilForm.value
      this.usuario.nombre = nombre
      this.usuario.email = email
      console.log(res)
      Swal.fire('Congrats', "Updated succesfully", 'success');

    }, (err) => {
      // Si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    })
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file
    if (!file) {
      return this.imgTemp = null
    }

    const reader = new FileReader()
    const url64 = reader.readAsDataURL(file)

    reader.onloadend = () => {
      this.imgTemp = reader.result
      console.log(reader.result)
    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Congrats', "Updated succesfully", 'success');
      }).catch(err => {
        Swal.fire('Error', err.error.msg, 'error');
      })

  }

}
