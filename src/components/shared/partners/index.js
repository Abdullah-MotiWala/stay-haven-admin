import React from 'react'
import Client1 from '../../../assets/images/client1.png'
import Client2 from '../../../assets/images/client2.png'
import Client3 from '../../../assets/images/client3.png'
import Client4 from '../../../assets/images/client4.png'
import Client5 from '../../../assets/images/client5.png'

function Partners() {
    return (
        <>
            <section class="partners">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="heading">
                                <h2>Our Partners</h2>
                            </div>
                            <div class="clientsl">
                                <div class="client_i"><img class="part_logo" src={Client1} alt="" /></div>
                                <div class="client_i"><img class="part_logo" src={Client2} alt="" /></div>
                                <div class="client_i"><img class="part_logo" src={Client3} alt="" /></div>
                                <div class="client_i"><img class="part_logo" src={Client4} alt="" /></div>
                                <div class="client_i"><img class="part_logo" src={Client5} alt="" /></div>
                            </div>

                        </div>
                    </div>
                </div>
            </section></>
    )
}

export default Partners