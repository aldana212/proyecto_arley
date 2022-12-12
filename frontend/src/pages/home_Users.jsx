import React from 'react'
import { Header } from '../components/header'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import img from '../img/estacion.jpg';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function Home_Users() {

    const navigate = useNavigate();

    const [cards, setCards] = useState([])

    const [cupos, setCupos] = useState('')
    const [codigo, setCodigo] = useState('')
    const [cedula, setCedula] = useState('')

    const handleReservar = async (e) => {
        e.preventDefault();
        console.log("hola")
        const datos = { cupos, codigo, cedula }
        await axios.post('http://localhost:3009/Trains/PostReserva', datos)
            .then(({ data }) => {
                toast.success(data.responde, {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setCupos("")
                handleClose()
            }).catch((err) => {
                console.log(err);
            })
    }

    const [cookies, setCookie, removeCookie] = useCookies([])

    useEffect(() => {
        getCards()
        veryToken()
    }, [])

    const veryToken = async () => {
        if (!cookies.jwt) {
            toast.error("error")
            navigate("/")
        } else {
            const { data } = await axios.get(
                'http://localhost:3009/user/Admin',
                {
                    withCredentials: true,
                })
            const cedula = data.data.cedula
            setCedula(cedula);
            if (!data.status) {
                removeCookie('jwt')
                navigate("/")
            } else {
                toast.success(`Bienvenido ${data.data.name}`, {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    }

    const logOut = () => {
        removeCookie('jwt')
        navigate("/")
    }

    const getCards = async () => {
        const { data } = await axios.get("http://localhost:3009/Trains/GetTrains")
        console.log(data)
        setCards(data.result)
    }

    // const [modalShow, setModalShow] = useState(false);
    const [show, setShow] = useState(false);

    // const ShowModelInser = () => setModalShow(true);

    const ShowModelInser1 = () => setShow(true);

    const handleClose = () => {
        setShow(false)
        // setModalShow(false)
    };

    return (
        <div>
            <Header logOut={logOut} />
            <div className="container shadow-lg p-3 bg-body rounded d-flex justify-content-center align-items-center ">
                <div class='row m-4'>
                    {cards.map((card) => (
                        <div className='col-sm-12 col-md-4 col-lg-4 py-3 ml-5'>
                            <Card style={{ width: '18rem' }} className='card shadow-lg '>
                                <div>
                                    <Card.Img src={img}></Card.Img>
                                    <Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Origen:  {card.origen}</ListGroup.Item>
                                            <ListGroup.Item>Destino:  {card.destino}</ListGroup.Item>
                                            <ListGroup.Item>Hora Salidad:  {card.hora_salidad}</ListGroup.Item>
                                            <ListGroup.Item>Precio:  {card.precio}</ListGroup.Item>
                                        </ListGroup>
                                        <Button className='btn-primary mt-3' onClick={() => ShowModelInser1(setCodigo(card.codigo_servicio))}>Reservar</Button>
                                    </Card.Body>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>


                <div classNameName="model_box">
                    <Modal
                        show={show}
                    >
                        <Modal.Header closeButton onClick={handleClose}>
                            <Modal.Title>Reservar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleReservar}>
                                <div className="form-group">
                                    <input type="text" name='cupos' onChange={(e) => { setCupos(e.target.value) }} value={cupos} className="form-control" />
                                </div>
                                <button type="submit" className="btn btn-success mt-4">Reservar</button>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>

        </div>
    )
}
