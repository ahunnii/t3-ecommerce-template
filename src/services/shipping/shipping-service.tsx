//using the interface, create a class that implements the interface
class ShippingLabelService implements IShippingLabelService {
  //implement the interface
  getShippingCost(shippingOption: IShippingOption): number {
    //logic to calculate shipping cost
    return 0;
  }
}
