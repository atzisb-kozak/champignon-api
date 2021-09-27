import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn
}from "typeorm";

@Entity()
export class Air extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	etatVanneFroid: number;

	@Column()
	temperatureAir:number;

	@Column()
	temperatureAirNonEtalonner:number;

	@Column()
	consigneAir:number;

	@Column()
	consigneattendu:number;

	@Column()
	etalAir:number;

	@Column()
	pasAir:number;
}

