function transformResponseData(response) {
  return {
    userDetail: {
      name: response.userDetail.addressDetail.name,
      phoneNo: response.userDetail.addressDetail.phoneNo,
      alternatePhoneNo: response.userDetail.addressDetail.alternatePhone,
      address: response.userDetail.addressDetail.address,
      cityTownVillage: response.userDetail.addressDetail.cityTownVillage,
      district: response.userDetail.addressDetail.district,
      state: response.userDetail.addressDetail.state,
      pinCode: response.userDetail.addressDetail.pinCode,
    },
    products: response.products[0].map((product) => ({
      product: product._id,
      quantity: product.quantity,
    })),
    totalAmount: response.totalAmount,
    paymentMode: response.paymentMode,
    paymentStatus: response.paymentStatus,
  };
}

export { transformResponseData };
