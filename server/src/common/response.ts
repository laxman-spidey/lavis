export class RESPONSE {
  public status: boolean = true;
  public message: string = "Success";
  public data: any;
  constructor(data: any = undefined) {
    this.data = data;
  }
}
