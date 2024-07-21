import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    makeStyles,
    Paper,
    styled,
    Typography,
} from '@material-ui/core';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OrderIframe from './components/OrderIframe';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/common';
import orderApi from '../../api/ordersApi';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginBottom: theme.spacing(2),
        backgroundColor: '#fdfdfd',
    },
    container: {
        padding: theme.spacing(2),
        backgroundColor: '#fff',
        borderRadius: theme.spacing(1),
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        paddingBottom: theme.spacing(2),
    },
    address: {},
    item: {},
    paymentMethod: {},
}));

const CustomRadio = styled(Radio)({
    '&.Mui-checked': {
        color: 'black',
    },
});

const OrderPage = () => {
    const classes = useStyles();
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('id');
    const [itemsList, setItemsList] = useState([]);
    const [paymentUrl,setPaymentUrl] =useState('');
    const shippingInfo = {
        receiver: 'Pham Thanh Son',
        phone: '0982201057',
        address: 'Thanh Tri , Ha Noi',
        adressDetail: 'so 6 , day D , Ngu Hiep',
    };

    const validationSchema = Yup.object().shape({
        paymentMethod: Yup.string().required('Vui lòng chọn phương thức thanh toán'),
    });

    const handleBuyNow = async (values) => {
        const { paymentMethod } = values; 
        console.log(paymentMethod);

        try {
            const res = await orderApi.payment(orderId, paymentMethod);
            const paymentUrl = res.paymentUrl.paymentInf.order_url;

            setPaymentUrl(paymentUrl);
            
            // Hiển thị iframe sau khi gọi API
            setIsIframeVisible(true);
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };
    
    const handleCloseIframe = () => {
        setIsIframeVisible(false);
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderApi.get(orderId);
                const itemsList = res.products;
                setItemsList(itemsList);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);
    return (
        <Box style={{ marginTop: '100px' }}>
            <Container style={{ marginTop: '120px', width: '1072px' }}>
                <Paper
                    elevation={0}
                    className={classes.paper}
                >
                    <Grid className={classes.container}>
                        <Box className={classes.address}>
                            <Typography
                                component='h3'
                                variant='h7'
                                style={{ fontFamily: 'monospace', marginBottom: '20px' }}
                            >
                                Địa chỉ nhận hàng
                            </Typography>
                            <Box style={{ display: 'flex' }}>
                                <Typography variant='body2'>{shippingInfo.receiver}</Typography>
                                <Typography variant='body2'>({shippingInfo.phone})</Typography>
                                <Typography variant='body2'>
                                    {shippingInfo.adressDetail}.
                                </Typography>
                                <Typography variant='body2'>{shippingInfo.address}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Paper>
            </Container>

            <Container style={{ width: '1072px' }}>
                <Paper
                    elevation={0}
                    className={classes.paper}
                >
                    <Grid className={classes.container}>
                        <Box className={classes.item}>
                            <Typography
                                component='h3'
                                variant='h6'
                                style={{ fontFamily: 'monospace', marginBottom: '20px' }}
                            >
                                Thông tin sản phẩm
                            </Typography>
                            <Box
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Header Row */}
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        width: '100%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        backgroundColor: '#f5f5f5',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <Box style={{ width: '20%', textAlign: 'center' }}>
                                        {/* <Typography variant='body2'>Ảnh</Typography> */}
                                    </Box>
                                    <Box style={{ width: '20%', textAlign: 'center' }}>
                                        <Typography
                                            component='h3'
                                            variant='h7'
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            Giá
                                        </Typography>
                                    </Box>
                                    <Box style={{ width: '20%', textAlign: 'center' }}>
                                        <Typography
                                            component='h3'
                                            variant='h7'
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            Số lượng
                                        </Typography>
                                    </Box>
                                    <Box style={{ width: '20%', textAlign: 'center' }}>
                                        <Typography
                                            component='h3'
                                            variant='h7'
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            Thành tiền
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* Product Rows */}
                                {itemsList.map((item, index) => (
                                    <Box
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            width: '100%',
                                            marginBottom: '10px',
                                            padding: '10px',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}
                                    >
                                        <Box
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '20%',
                                            }}
                                        >
                                            <Typography variant='body2'>Ảnh</Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '20%',
                                            }}
                                        >
                                            <Typography variant='body2'>
                                                {formatPrice(item.price)}
                                            </Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '20%',
                                            }}
                                        >
                                            <Typography variant='body2'>{item.quantity}</Typography>
                                        </Box>
                                        <Box
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '20%',
                                            }}
                                        >
                                            <Typography variant='body2'>
                                                {formatPrice(item.quantity * item.price)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Paper>
            </Container>

            <Container style={{ width: '1072px' }}>
                <Paper
                    elevation={0}
                    className={classes.paper}
                >
                    <Grid className={classes.container}>
                        <Box className={classes.paymentMethod}>
                            <Typography
                                component='h3'
                                variant='h7'
                                style={{ fontFamily: 'monospace', marginBottom: '20px' }}
                            >
                                Phương thức thanh toán
                            </Typography>
                            <Box>
                                <Formik
                                    initialValues={{ paymentMethod: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleBuyNow}
                                >
                                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Box sx={{ padding: 2 }}>
                                                <FormControl component='fieldset'>
                                                    <RadioGroup
                                                        aria-label='payment-method'
                                                        name='paymentMethod'
                                                        value={values.paymentMethod}
                                                        onChange={handleChange}
                                                    >
                                                        <FormControlLabel
                                                            value='payment'
                                                            control={<CustomRadio />}
                                                            label={
                                                                <Box
                                                                    display='flex'
                                                                    alignItems='center'
                                                                >
                                                                    <AccountBalanceIcon
                                                                        sx={{ marginRight: 1 }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant='body1'>
                                                                            Chuyển khoản ngân hàng
                                                                        </Typography>
                                                                        <Typography variant='body2'>
                                                                            Thực hiện thanh toán vào
                                                                            ngay tài khoản ngân hàng
                                                                            của chúng tôi. Vui lòng
                                                                            sử dụng Mã đơn hàng của
                                                                            bạn trong phần Nội dung
                                                                            thanh toán. Đơn hàng sẽ
                                                                            được giao sau khi tiền
                                                                            đã chuyển.
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value='cash'
                                                            control={<CustomRadio />}
                                                            label={
                                                                <Box
                                                                    display='flex'
                                                                    alignItems='center'
                                                                >
                                                                    <LocalShippingIcon
                                                                        sx={{ marginRight: 1 }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant='body1'>
                                                                            Trả tiền mặt khi nhận
                                                                            hàng
                                                                        </Typography>
                                                                        <Typography variant='body2'>
                                                                            Trả tiền mặt khi giao
                                                                            hàng
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Box>
                                            <Button
                                                type='submit'
                                                style={{
                                                    border: '1px solid black',
                                                    margin: '15px',
                                                    borderRadius: '0px',
                                                }}
                                            >
                                                Đặt hàng
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                        </Box>
                    </Grid>
                </Paper>
            </Container>

            <OrderIframe
                isVisible={isIframeVisible}
                handleClose={handleCloseIframe}
                url={paymentUrl}
                orderId={orderId}
            />
        </Box>
    );
};

export default OrderPage;
