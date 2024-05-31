import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { values } from 'd3';
import { ProductsDeleteComponent } from '../main/products-delete/products-delete.component';
import { ProductsService } from '../products.service';
import { NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {


  single: any[] = [];
  legend: boolean = false;

  initialLetter:any[] = [];
  contactsByFullName: any[]= [];
  emailExtensions: any[]= [];
  phonePrefixData: any[]= [];
  unaProduc:  any[]= [];
  dosProducts:  any[]= [];
  tresNewChartProduct:  any[]= [];
  tresNewChartProductStock:  any[]= []
  cuartaSimple:  any[]= [];

  constructor(private contactService: ContactsService,
    private servicePro: ProductsService
  ) { }

  ngOnInit(): void {
    this.contactService.getContacts().subscribe( (contacts: any[]) =>{
      //donde llegan la lista de datos
      /*** tabla uno guarda y calculas los datos a mostrary despues los
       * estamos ordenando
       */
      this.initialLetter = this.calculateInitialLettersData(contacts);
      this.initialLetter.sort((a,b)=> a.name.localeCompare(b.name));
      /**segunda tabla  rango de largos de nombre*/
      this.contactsByFullName = this.calculateContactsByFullNameData(contacts);
      /** tercera tabla seteo de datos de extensiones de email */
      this.emailExtensions = this.calculateEmailExtensionsData(contacts);
      /**cuarta tabla prefijo de telefonos */
      this.phonePrefixData = this.generatePhonePrefixData(contacts);
    })

    this.servicePro.getProducts().subscribe(data =>{
      this.unaProduc = this.tablaUnoProduct(data);
      this.dosProducts= this.tablaDos(data);
      this.tresNewChartProduct = this.tablaTres(data);

      this.tresNewChartProductStock = this.tablaTresStock(data);
      this.cuartaSimple = this.cuartaTProducto(data);
    })
  }

  cuartaTProducto(products: any[]){
    return products.reduce((result: any[], product) =>{
      const fecha = new Date(product.date_added);
      const mes = this.formatoMesString(fecha.getMonth());
      if ( result.find(item => item.name === mes)){
        result.find(item => item.name === mes).value++;
      }else{
        result.push({name: mes, value: 1});
      }
      return result;
    }, [])
  }


  tablaTres(products: any[]){
    return products.reduce((result: any[], product) =>{
      const initial = product.active? "Activado": "Desactivado";
      if ( result.find(item => item.name === initial)){
        result.find(item => item.name === initial).value++;
      }else{
        result.push({name: initial, value: 1});
      }
      return result;
    },[])
  }


  tablaTresStock(products: any[]){
    return products.reduce((result: any[], product) =>{
      const initial = product.active? "Activado": "Desactivado";
      if ( result.find(item => item.name === initial)){
        result.find(item => item.name === initial).value += product.stock ;
      }else{
        result.push({name: initial, value: product.stock});
      }
      return result;
    },[])
  }
  /*tablaDos(products: any[]): any[]{
    const returndata= [{
      name: 'productos activos',
      series: <any[]>[]
    }]
    products.forEach(product=>{
      if(product.active){
        const size = product.price;
        const range = `${size -(size % 7)} - ${size - (size % 7) + 6} €.`;

        const existingRange = returndata[0].series.find(item => item.name === range);
        if(existingRange){
          existingRange.value++;
        }else{
          returndata[0].series.push({name: range, value: 1})
        }
      }

    });

    return returndata.map( entry => {
      return {
        ...entry,
        series: entry.series.sort((a,b) => Number(a.name.split('-')[0]) - Number(b.name.split('-')[0]))
      }
    });
  }*/

  /*tablaDos(products: any[]): any[]{
    const returndata= [{
      name: 'productos activos',
      series: <any[]>[]
    },{
      name: 'productos desactivados',
      series: <any[]>[]
    }]
    products.forEach(product=>{
      const size = product.price;
      const range = `${size -(size % 7)} - ${size - (size % 7) + 6} €.`;
      var index = 0;
      if (!product.active){
        index = 1;
      }
      const existingRange = returndata[index].series.find(item => item.name === range);
      if(existingRange){
        existingRange.value++;
      }else{
        returndata[index].series.push({name: range, value: 1})
      }
    });

    return returndata.map( entry => {
      return {
        ...entry,
        series: entry.series.sort((a,b) => Number(a.name.split('-')[0]) - Number(b.name.split('-')[0]))
      }
    });
  }*/

  tablaDos(products: any[]): any[]{
    const returndata= [{
      name: 'productos activos',
      series: <any[]>[]
    },{
      name: 'productos desactivados',
      series: <any[]>[]
    }]
    products.forEach(product=>{
      const size = product.price;
      const range = `${size -(size % 7)} - ${size - (size % 7) + 6} €.`;
      var index=0;
      if (!product.active){
        index=1;
      }
      const existingRange = returndata[index].series.find(item => item.name === range);
      if(existingRange){
        existingRange.value++;
      }else{
        returndata[index].series.push({name: range, value: 1})
      }
      if(product.active){
        //añadi arriba en returndata[0]
        //ahora miro entonces si existe en DESACTIVADO = returndata[1]
        const existeEnElContrario1 = returndata[1].series.find(item => item.name === range);
        if(!existeEnElContrario1){//si no existe en el 1 o lo que es lo mismo en el Desactivado
          //lo añadimos en el desactivado con valor 0
          returndata[1].series.push({name: range, value: 0})
        }
      }else {
        //añadi arriba en returndata[1]
        //ahora miro entonces si existe en ACTIVADO = returndata[0]
        const existeEnElContrario0 = returndata[0].series.find(item => item.name === range);
        if(!existeEnElContrario0){//si no existe en el 0 o lo que es lo mismo en el ACTIVADO
          //lo añadimos en el activado con valor 0
          returndata[0].series.push({name: range, value: 0})
        }
      }
    });

    return returndata.map( entry => {
      return {
        ...entry,
        series: entry.series.sort((a,b) => Number(a.name.split('-')[0]) - Number(b.name.split('-')[0]))
      }
    });
  }

  tablaUnoProduct(productos: any[]): any[]{
    const productoStock: any[] = [];
    productos.forEach(producto =>{

      if (producto.active){
         productoStock.push({name: producto.name , value: parseInt(producto.stock)});
      }
    })
    return productoStock;
  }

  generatePhonePrefixData(contacts: any[]): any[]{
    const phonePrefixData = [];

    const prefixCounts: any = {};
    contacts.forEach(contact => {
      if(contact.telephone){
        const phonePrefix = contact.telephone.substring(0, contact.telephone.trim().indexOf(' '));
        if(prefixCounts[phonePrefix]){
          prefixCounts[phonePrefix]++
        }else{
          prefixCounts[phonePrefix] = 1;
        }
      }
    });

    for (const prefix in prefixCounts){
      if(prefixCounts.hasOwnProperty(prefix)){
        phonePrefixData.push({name: prefix , value:prefixCounts[prefix]});
      }
    }
    return phonePrefixData;
  }

  calculateEmailExtensionsData(contacts: any[]): any[]{
    const emailExtensionMap: any = new Map<string, number>();

    contacts.forEach(contact => {
      const emailParts = contact.email.split('@');
      if (emailParts.length === 2){
        //selecionamos el dominio es la segunda parte la 0 antes del @ la 1 es todo lo que va despues
        const domain = emailParts[1];
        const firstDotindex = domain.indexOf('.');
        if (firstDotindex !== -1){
          const extension =  domain.substring(firstDotindex);
          if(emailExtensionMap.has(extension)){
            emailExtensionMap.set(extension, emailExtensionMap.get(extension) + 1);
          }else {
            emailExtensionMap.set(extension, 1);
          }
        }
      }
    })
    const emailExtensions:any[] = [];
    emailExtensionMap.forEach((value:any, key: any) => {
      emailExtensions.push({ name: key, value: value})
    })
    return emailExtensions;
  }

  calculateContactsByFullNameData(contacts:any[]):any[]{
    const tempContactsByFullName= [{
      name: 'Contacts',
      series: <any[]>[]
    }]
    contacts.forEach(contact=>{
      const fullName = contact.name + contact.surname + contact.lastname;
      const size = fullName.length;
      const range = `${size -(size % 5)} - ${size - (size % 5) + 4} ch.`;

      const existingRange = tempContactsByFullName[0].series.find(item => item.name === range);
      if(existingRange){
        existingRange.value++;
      }else{
        tempContactsByFullName[0].series.push({name: range, value: 1})
      }
    });

    return tempContactsByFullName.map( entry => {
      return {
        ...entry,
        series: entry.series.sort((a,b) => Number(a.name.split('-')[0]) - Number(b.name.split('-')[0]))
      }
    });

  }


  calculateInitialLettersData(contacts: any[]): any[]{
    return contacts.reduce((result: any[], contact) =>{
      const initial = contact.surname.charAt(0).toUpperCase();
      if ( result.find(item => item.name === initial)){
        result.find(item => item.name === initial).value++;
      }else{
        result.push({name: initial, value: 1});
      }
      return result;
    },[])
  }

  formatAxisTick(value: number){
    return Math.floor(value).toString();
  }
  formatoValoresIfString(value: any){
    return Math.floor(parseInt(value)).toString();
  }
  formatoMesString(value: any){

    switch(parseInt(value)) {
      case 0: {
         return "enero"
      }
      case 1: {
         return "febrero";
      }
      case 2: {
         return "marzo";
      }
      case 3: {
         return "abril";
      }
      case 4: {
         return "mayo";
      }
      case 5: {
         return "junio";
      }
      case 6: {
         return "julio";
      }
      case 7: {
         return "agosto";
      }
      case 8: {
         return "septiembre";
      }
      case 9: {
         return "octubre";
      }
      case 10: {
         return "noviembre";
      }
      case 11: {
         return "diciembre";
      }
      default: {

        return "error";
      }
   }
  }
}
