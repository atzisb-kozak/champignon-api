import { Air } from "./models/air";
import { Hum } from "./models/hum";
import { Co2 } from "./models/Co2";
import { getRepository, Repository } from "typeorm";
import { CreateAir, UpdateAir } from "./interface/air";
import { CreateCo2, UpdateCo2 } from "./interface/co2";
import { CreateHum, UpdateHum } from "./interface/hum";
import { logger } from 'logger';

const _Air: Repository<Air> = getRepository(Air);
const _Hum: Repository<Hum> = getRepository(Hum);
const _Co2: Repository<Co2> = getRepository(Co2);

export async function air(): Promise<Air[]> {
    return _Air.find();
 }
 
export async function airID(id: number): Promise<Air| undefined> {
    return _Air.findOne(id);
}
export async function lastAir(): Promise<Air | undefined> {
	return (await _Air.find({order: {id: "DESC"}}))[0]
}
export async function createAir(air: CreateAir): Promise<any> {
  try {
    const dataair = _Air.create(air);
    return await dataair.save();
  } catch (error) {
    logger.error(`[bdd](createAir) : ${error}`);
  }
}
 
export async function updateAir (air: UpdateAir, id: number):  Promise<any> {
  try {
    const nbAffect = (await _Air.update(id, {...air})).affected;
      if (nbAffect !== 0){
        return true;
    }
    throw new Error('data wasn\'t stored in database');
  } catch (error) {
    logger.error(`[bdd](updateAir) : ${error}`);
    return false;
  }
}
export async function deleteAir (id: number): Promise<any> {
  try {
    const nbAffect = (await _Air.delete(id)).affected;
    if (nbAffect !== 0) {
      return true;
    }
    throw new Error('data wasn\'t stored in database');
  } catch (error) {
    logger.error(`[bdd](deleteAir) : ${error}`);
    return false;
  }
}

export async function hum(): Promise<Hum[]> {
  return _Hum.find();
}

export async function humID(id: number): Promise<Hum| undefined> {
  return _Hum.findOne(id);
}
export async function lastHum(): Promise<Hum | undefined> {
	return (await _Hum.find({order: {id: "DESC"}}))[0]
}
export async function createHum(hum: CreateHum): Promise<any> {
  try {
    const dataHum = _Hum.create(hum);
    return await dataHum.save();
  } catch (error) {
    logger.error(`[bdd](createHum) : ${error}`);
  }
}
 
export async function updatHum (Hum: UpdateHum, id: number):  Promise<any> {
  try {
    const nbAffect = (await _Hum.update(id, {...Hum})).affected;
      if (nbAffect !== 0){
        return true;
      }
      throw new Error('data wasn\'t stored in database');
  } catch (error) {
    logger.error(`[bdd](updateHum) : ${error}`);
    return false;
  }
}
export async function deleteHum (id: number): Promise<any> {
  try {
    const nbAffect = (await _Hum.delete(id)).affected;
    if (nbAffect !== 0) {
      return true;
    }
    throw new Error('data wasn\'t stored in database');
   }catch (error) {
    logger.error(`[bdd](deleteHum) : ${error}`);
    return false;
   }
}
export async function co2(): Promise<Co2[]> {
  return _Co2.find();
}

export async function co2ID(id: number): Promise<Co2| undefined> {
  return _Co2.findOne(id);
}
export async function lastCo2(): Promise<Co2 | undefined> {
	return (await _Co2.find({order: {id: "DESC"}}))[0]
}
export async function createCo2(Co2: CreateCo2): Promise<any> {
  try {
    const dataCo2 = _Co2.create(Co2);
    return await dataCo2.save();
  } catch (error) {
    logger.error(`[bdd](createCo2) : ${error}`);
  }
}

export async function updateCo2 (Co2: UpdateCo2, id: number):  Promise<any> {
  try {
    const nbAffect = (await _Co2.update(id, {...Co2})).affected;
    if (nbAffect !== 0){
      return true;
    }
    throw new Error('data wasn\'t stored in database');
  } catch (error) {
    logger.error(`[bdd](updateCo2) : ${error}`);
    return false;
  }
}
export async function deleteCo2 (id: number): Promise<any> {
  try {
    const nbAffect = (await _Co2.delete(id)).affected;
    if (nbAffect !== 0) {
      return true;
    }
    throw new Error('data wasn\'t stored in database');
  }catch (error) {
    logger.error(`[bdd](deleteCo2) : ${error}`);
    return false;
  }
}