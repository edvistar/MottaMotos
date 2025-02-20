import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompartidoService } from 'src/app/compartido/compartido.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Marca } from 'src/app/Marcas/Interfaces/marca';
import { MarcaService } from 'src/app/Marcas/services/marca.service';
import { Category } from 'src/app/Categoria/interfaces/category';
import { CategoryService } from 'src/app/Categoria/services/category.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
marcas: Marca[] = [];
category: Category[] = [];
productId:number | null = null;
selectedFiles: File[] = []; // Array para almacenar los archivos seleccionados
images: string[] = []; // Lista de rutas de imágenes seleccionadas para previsualización

@Input() datosProduct: Product | null = null;
  formProduct: FormGroup;
  titulo: string = "Agregar";
  nombreBoton: string = "Guardar";
  errorMessage: string | undefined;
  previewUrls: any;

  constructor(private fb: FormBuilder,
    private _compartidoService: CompartidoService,
    private _productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private _marcaService: MarcaService,
    private _categoryService: CategoryService
  ){
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      serialNumber: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      offer: ['', Validators.required],
      price: ['', Validators.required],
      cost: ['', Validators.required],
      categoriaId: ['', Validators.required],
      marcaId: ['', Validators.required],
      imagenes: ['']
  });

  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      // Asignamos directamente los archivos seleccionados al array selectedFiles
      this.selectedFiles = Array.from(input.files);

      // Generamos las miniaturas para previsualización si es necesario
      this.images = this.selectedFiles.map((file) => URL.createObjectURL(file));

      // Puedes ver las imágenes cargadas para depurar
      console.log("Imágenes seleccionadas:", this.selectedFiles);
    }
  }

  // CrearModificarProduct() {
  //   console.log("Llamo al crearModificar");

  //   if (this.formProduct.valid) {
  //     const formData = new FormData();

  //     // Agregar los campos del producto a FormData
  //     formData.append("id", this.productId ? this.productId.toString() : "0");
  //     formData.append("name", this.formProduct.value.name);
  //     formData.append("serialNumber", this.formProduct.value.serialNumber);
  //     formData.append("description", this.formProduct.value.description);
  //     formData.append("status", this.formProduct.value.status);
  //     formData.append("offer", this.formProduct.value.offer.toString());
  //     formData.append("price", this.formProduct.value.price.toString());
  //     formData.append("cost", this.formProduct.value.cost.toString());
  //     formData.append("categoriaId", this.formProduct.value.categoriaId.toString());
  //     formData.append("marcaId", this.formProduct.value.marcaId.toString());

  //     // Agregar múltiples imágenes
  //     this.selectedFiles.forEach((file, index) => {
  //       formData.append("imagenes", file); // "imagenes" debe coincidir con el nombre esperado en el backend
  //     });
  //     console.log(this.selectedFiles);
  //     if (this.productId) {
  //       console.log("id enviado", this.productId);
  //       // Editar producto
  //       this._productService.editar(formData).subscribe({
  //         next: () => {
  //           this._compartidoService.mostrarAlerta('El Producto se actualizó con éxito!', 'Completo');
  //           this.router.navigate(['/layout/ListProduct']);
  //         },
  //         error: (e) => {
  //           console.error("Error al actualizar producto:", e);
  //           this._compartidoService.mostrarAlerta('No se actualizó el Producto', 'Error!');
  //         }
  //       });
  //     } else {
  //       console.log("No edito, va a crear");
  //       // Crear nuevo producto
  //       this._productService.crear(formData).subscribe({
  //         next: () => {
  //           console.log(formData);
  //           this._compartidoService.mostrarAlerta('El Producto se creó con éxito!', 'Completo');
  //           this.router.navigate(['/layout/ListProduct']);
  //         },
  //         error: (e) => {
  //           console.error("Error al crear producto:", e);
  //           this._compartidoService.mostrarAlerta('No se creó el Producto', 'Error!');
  //         }
  //       });
  //     }
  //   } else {
  //     this.errorMessage = 'Formulario inválido. Corrige los errores e intenta nuevamente.';
  //   }
  // }

  CrearModificarProduct() {
    console.log("Imágenes seleccionadas dentro de crear modificar:", this.selectedFiles);

    if (this.formProduct.valid) {
      const formData = new FormData();

      // Agregar los campos del producto
      formData.append("id", this.productId ? this.productId.toString() : "0");
      formData.append("name", this.formProduct.value.name);
      formData.append("serialNumber", this.formProduct.value.serialNumber);
      formData.append("description", this.formProduct.value.description);
      formData.append("status", this.formProduct.value.status);
      formData.append("offer", this.formProduct.value.offer.toString());
      formData.append("price", this.formProduct.value.price.toString());
      formData.append("cost", this.formProduct.value.cost.toString());
      formData.append("categoriaId", this.formProduct.value.categoriaId.toString());
      formData.append("marcaId", this.formProduct.value.marcaId.toString());

      // Aseguramos que `selectedFiles` contiene archivos antes de agregarlos
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          formData.append("archivos", file); // "imagenes[]" debe coincidir con el nombre esperado en el backend
          console.log("Enviando archivo:", file.name);
        });
      } else {
        console.warn("No hay archivos seleccionados.");
      }
      // Enviar al backend
      if (this.productId) {
        // Editar producto
        this._productService.editar(formData).subscribe({
          next: () => {
            this._compartidoService.mostrarAlerta('Producto actualizado con éxito!', 'Completo');
            this.router.navigate(['/layout/ListProduct']);
          },
          error: (e) => {
            console.error("Error al actualizar:", e);
            this._compartidoService.mostrarAlerta('Error al actualizar producto', 'Error!');
          }
        });
      } else {
        // Crear nuevo producto
        this._productService.crear(formData).subscribe({
          next: () => {
          console.log("formData",formData)
            this._compartidoService.mostrarAlerta('Producto creado con éxito!', 'Completo');
            this.router.navigate(['/layout/ListProduct']);
          },
          error: (e) => {
            console.error("Error al crear:", e);
            this._compartidoService.mostrarAlerta('Error al crear producto', 'Error!');
          }
        });
      }
    } else {
      this.errorMessage = 'Formulario inválido. Corrige los errores e intenta nuevamente.';
    }
  }


  ngOnInit(): void {
    this.obtenerMarcas();
    this.obtenerCategorias();
  }
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files.length > 0) {
  //     this.images = []; // Limpiar las miniaturas previas
  //     this.selectedFiles = Array.from(input.files); // Guardar los archivos seleccionados

  //     this.selectedFiles.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const result = e.target?.result;
  //         if (result) {
  //           this.images.push(result as string); // Agregar la URL generada para previsualizar
  //           console.log(`🖼️ Previsualización generada para: ${file.name}`);
  //         }
  //       };
  //       reader.readAsDataURL(file); // Leer como URL de datos
  //     });

  //     // Verificar que los archivos fueron seleccionados correctamente
  //     console.log("✅ Archivos seleccionados:", this.selectedFiles.map(f => f.name));
  //   } else {
  //     console.warn("⚠️ No se seleccionaron archivos.");
  //   }
  // }

  obtenerMarcas(){
      this._marcaService.lista().subscribe({
        next: (data) => {
            if(data.isExitoso){
              this.marcas = data.resultado;
              console.log("Marcas: ", data.resultado);
            } else
              this._compartidoService.mostrarAlerta(
                'No se  encontraron datos',
                'Advertencia!'
              );
          },
          error: (e) => {
            this._compartidoService.mostrarAlerta(e.error.mensaje, 'Error!');
            console.error('Error al obtener las marcas', e);
          },
      });
    }
    obtenerCategorias(){
      this._categoryService.lista().subscribe({
        next: (data) => {
            if(data.isExitoso){
              this.category = data.resultado;
              console.log("Categoria: ", data.resultado);
            } else
              this._compartidoService.mostrarAlerta(
                'No se  encontraron datos',
                'Advertencia!'
              );
          },
          error: (e) => {
            this._compartidoService.mostrarAlerta(e.error.mensaje, 'Error!');
            console.error('Error al obtener las marcas', e);
          },
      });
    }
}
