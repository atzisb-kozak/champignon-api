import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn
}from "typeorm";

   
@Entity()
export class Hum extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    temperatureSec:number;
    @Column()
	temperatureHum:number;
    @Column()
	tauxHumidite:number;
    @Column()
    consigneHum:number;
    @Column()
	consigneattendu:number;
    @Column()
	etalSec:number;
    @Column()
    etalHum:number;
    @Column()
    pasHum:number;

}
