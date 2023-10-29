/**
 * vessel controller
 */

import { factories } from '@strapi/strapi'
import { scrap } from '../../../../utils/scrap';
export default factories.createCoreController('api::vessel.vessel', ({ strapi }) => ({
    async ScrapeVessel(ctx) {
        const { contain_name } = ctx.request.body;

        if (!contain_name) return ctx.badRequest('missing.contain_name');
        const vessel = await scrap({name:contain_name})
        console.log(vessel)
        let Imos = vessel.map((v, i) => v['IMO'])
        console.log({"Imos":Imos})
        let ImoExist = await strapi.entityService.findMany('api::vessel.vessel',{
            filters: {
                IMO: {
                    $in: Imos,
                }
            }
        })
        console.log({"ImoExist":ImoExist})
        vessel.map(async (v, i) => {
            let cek = ImoExist.find((ie, i) => ie['IMO'] == v['IMO']);
            console.log({"ImoExist":ImoExist,"v":v})
            if (cek == undefined) {
                await strapi.entityService.create("api::vessel.vessel", {
                    data: v,
                });
            } else {
                await strapi.entityService.update("api::vessel.vessel", cek['id'], {
                    data: v,
                });
            }
        })
        return [vessel]
    }
}));
