import React, {useEffect} from 'react';
import {SafeAreaView, ActivityIndicator, View, Dimensions} from 'react-native';
import IMP from 'iamport-react-native';

const PaymentPage = props => {
  const {route, navigation} = props;
  const {params} = route;

  const Loading = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}>
      <ActivityIndicator color="#0085CA" size={'large'} />
    </View>
  );
  /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
  const data = {
    pg: params.pg,
    pay_method: params.pay_method,
    name: `${params?.name} `,
    merchant_uid: `${params.merchant_uid}`, //상품 조회 키값으로 설정
    amount: params.amount,
    buyer_name: params.buyer_name,
    buyer_tel: params.buyer_tel,
    buyer_email: params.buyer_email,
    buyer_addr: params.buyer_addr,
    buyer_postcode: '',
    app_scheme: 'payment',
    customer_uid: params?.customer_uid,
    digital: false,
    // [Deprecated v1.0.3]: m_redirect_url
  };
  const program_pay_reg_handle = async response => {
    console.log('response ::: ', response);
  };
  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
      <SafeAreaView style={[{flex: 1, backgroundColor: '#fff'}]}>
        <IMP.Payment
          userCode={params?.usercode}
          loading={<Loading />}
          data={data}
          callback={response => {
            console.log(response);
            if (response.imp_success === 'true') {
              program_pay_reg_handle(response);
            } else {
              navigation.goBack();
              return;
            }
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
    </>
  );
};

export default PaymentPage;
