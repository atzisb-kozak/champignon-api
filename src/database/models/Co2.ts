import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn
}from "typeorm";

@Entity()
export class Co2 extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    dureeVariateurOff:number;
    @Column()
	consigneCo2:number;
    @Column()
	co2:number;
    @Column()
    freq:number;
    @Column()
	consigneattendu:number;
   
    @Column()
    pasCo2:number

}
