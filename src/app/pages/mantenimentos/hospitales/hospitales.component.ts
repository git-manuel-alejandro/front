import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../interfaces/hospitales-form.interface';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public imgSubs: Subscription


  constructor(
    private hospitalService: HospitalService,
    public modalImagenService: ModalImagenService
  ) { }

  public hospitales = []
  public cargando = true


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.readHospitales()
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.readHospitales())
  }

  readHospitales() {
    this.hospitalService.cargarHospitales().subscribe((res: any) => {
      this.hospitales = res.hospitales
      this.cargando = false
      // console.log(res.hospitales)
    }, err => {
      console.log(err)
    })
  }

  actualizarHospital(hospital) {
    this.hospitalService.actualizarHospitales(hospital.nombre, hospital._id)
      .pipe(delay(100))
      .subscribe((res) => {

        Swal.fire(
          'Updated!!',
          'Congrats',
          'success'
        )
        this.readHospitales()
        // console.log(res)
      }, (err) => {

        Swal.fire(
          'Wrong',
          err.error.msg,
          'error'
        )
        this.readHospitales()
        console.log(err)
      })
  }

  eliminarHospital(hospital) {
    this.hospitalService.eliminarHospitales(hospital._id).subscribe((res) => {
      this.readHospitales()
      Swal.fire('Borrado', hospital.nombre, 'success')
    })
  }

  async abrirSweetAlert() {
    const valor = await Swal.fire({
      input: 'text',
      inputPlaceholder: 'Nombre Hospital',
      showCancelButton: true,
    })

    let value: any = valor.value

    if (value == undefined) {
      value = ''
    }

    if (typeof value === 'string' && value.length > 0) {
      this.hospitalService.crearHospitales(value)
        .pipe(delay(100))
        .subscribe((res: any) => {
          Swal.fire('Ingresado', res.hospital.nombre, 'success')
          this.readHospitales()
          // console.log(res)
        }, (error) => {
          // console.log(error.error)
          Swal.fire('Cancelado', error.error.errors.nombre.msg, 'error')
        })
    }


  }

  abrirModal(hospital: Hospital) {
    // console.log(hospital)
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img)


  }
}
