import os
import shutil
import re

# Directory paths
src_dir = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\food_pictures"
dest_dir = r"c:\Users\admin\OneDrive\Рабочий стол\NewProg\FitAI\public\foods"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

# Mapping of keywords in filenames to categories/slugs from Product_prompt_to_gen.md
# We'll use the target slugs from the markdown file.

mapping = {
    "A_steaming_plate_of_traditional": ["uz_fargona_palovi", "qovurilgan_fargona_palovi", "uz_nahor_osh", "bahorgi_palov", "behi_palov", "buxoro_palov", "choyxona_palov", "farg_ona_palov", "kovatok_palov", "mayiz_palov", "mol_go_shtli_palov", "no_xatli_palov", "qashqadaryo_palov", "qazili_palov", "qo_y_go_shtli_palov", "qovurma_palov", "safaki_palov", "samarqand_palov", "sarimsoqli_palov", "tovuqli_palov", "xorazm_palov", "zog_ora_palov", "uz_osh"],
    "Steamed_dumplings_served_on_plate": ["uz_manti", "manti_dumba_jigar", "manti_jigarli", "manti_kartoshkali", "manti_ko_katli", "manti_qovoqli", "ochiq_manti_gul_manti", "qovurma_manti", "xonim_kartoshkali"],
    "Golden-brown_flaky_pastry_meat": ["uz_somsa_mol", "uz_somsa_qovoq"],
    "Soup_with_meat_and_vegetables": ["uz_lagmon", "uz_shurva", "uz_mastava", "uz_chuchvara", "baliq_shurva", "cho_pon_shurva", "chuchvara_shurva", "do_lma_shurva", "kifta_shurva", "kuza_shurva", "loviyali_shurva", "makaron_shurva", "qaynatma_shurva", "qiyma_shurva", "qovurma_shurva", "tuxum_shurva", "yovvoyi_shurva", "uy_lagmonli_shorva", "kartoshka_sabzili_shorva", "karam_shurva"],
    "Dimlama_in_cast_iron_pot": ["uz_dimlama"],
    "Uzbek_Norin_with_horse_meat": ["uz_norin"],
    "Uzbek_Lagman_noodles_meat_sauce": ["chuzma_lag_mon", "kesma_lag_mon", "lag_mon_qovurma", "lag_mon_suyuq", "tovuqli_lag_mon", "uyg_ur_lag_mon", "uygur_lagmoni", "shivit_oshi", "mosh_ugra", "ugra_oshi"],
    "Uzbek_Kazan-Kabob_meat_potatoes": ["cho_pon_kabob", "do_lma_kabob", "jiz_biz_kabob", "lulya_kabob", "ozbekcha_qovurma_qozon_kabob", "qozonkabob_mol", "qozonkabob_qo_y", "qozonkabob_tovuq", "tandir_kabob", "uz_kabob"],
    "Grilled_meat_on_skewers": ["g_ijduvon_shashlik", "katta_shashlik_napaleon", "shashlik_baliq", "shashlik_beshpanja", "shashlik_buyrak", "shashlik_dumba", "shashlik_jigar_mol", "shashlik_jigar_qo_y", "shashlik_kartoshka", "shashlik_mol_jaz", "shashlik_pomidor", "shashlik_qanotcha", "shashlik_qiyma_mol", "shashlik_qiyma_qo_y", "shashlik_qo_y_jaz", "shashlik_rulet", "shashlik_sabzavot", "shashlik_tovuq", "qoy_goshtidan_shashlik"],
    "Various_baked_and_mashed_potato": ["anna_kartoshkasi", "kartoshkali_zapekanka", "pishloqli_pishirilgan_kartoshka", "qaymoqli_pishirilgan_kartoshka", "sarimsoqli_kartoshka", "sariyogli_kartoshka_pyuresi", "smetanali_kartoshka"],
    "Glass_of_fresh_milk": ["sut_15", "sut_32", "uz_sut_obezj", "biya_suti", "echki_suti", "qoy_suti", "pishirilgan_sut_topl_moloko", "sut_kam_yogli_suyuq_1_yogli_a_va_d_vitamini_qoshilgan", "sut_kamaytirilgan_yogli_suyuq_2_yogli_a_va_d_vitamini_qoshilgan", "sut_toliq_yogli_325_yogli_d_vitamini_qoshilgan", "sut_yogsiz_skim_suyuq_a_va_d_vitamini_qoshilgan", "quruq_sut", "sut_zardobi", "paxta_sut_buttermilk_kam_yogli", "tuya_suti"],
    "Kefir_in_ceramic_cup": ["uz_kefir", "kefir_1", "kefir_25", "kefir_32", "biokefir", "ayron", "qatiq", "shubat_tuya_kefiri", "qimiz", "bolalar_uchun_kefir", "ryajenka", "varenets", "atsidofilin", "biolakt", "aralash_snejok", "snejok_ichimlik_yogurt", "yogsizlangan_kefir", "kefir_qoziqorini"],
    "Bowl_of_thick_cream": ["smetana_10", "smetana_15", "smetana_20", "smetana_25", "smetana_30", "smetana_toliq_yogli", "davolovchi_smetana", "qaymoq_10", "qaymoq_20", "qaymoq_33", "quyuq_qaymoq", "krem_fresh"],
    "Fresh_white_curd_cheese": ["uz_suzma", "tvorog", "bolalar_tvorogi", "suzma", "bolalar_uchun_tvorogcha", "tvorog_5", "tvorog_9", "tvorog_massasi_mayizli", "yogsiz_tvorog", "tvorog_kottej_pishloq_toliq_yogli_yirik_yoki_mayda_donador", "tvorog_pishloq_kottej_kam_yogli_2_yogli"],
    "Blocks_of_cheese_on_board": ["uz_pishloq", "chedder_pishlogi", "adigey_pishlogi", "bri_pishlogi", "brinza_pishlogi", "gauda_pishlogi", "motsarella", "parmezan_pishlogi", "suluguni", "maasdam_pishlogi", "echki_pishlogi", "edam_pishlogi", "filadelfiya_pishlogi_krem_pishloq", "kok_mogorli_pishloq", "oq_mogorli_pishloq", "qurt_quritilgan_pishloq", "chechil_pishlogi", "orilgan_pishloq_chechil", "orim_pishloq_dudlangan", "pishloq_chedder", "pishloq_feta_toliq_yogli_sutdan_uvalangan", "pishloq_monterey_jek_qattiq", "pishloq_motsarella_kam_namlikli_yarim_yogsiz_sutdan", "pishloq_parmezan_maydalangan", "pishloq_parmezan_maydalangan_sovutilgan", "pishloq_rikotta_toliq_yogli_sutdan", "pishloq_shveytsariya", "rossiya_pishlogi", "rokfor_pishlogi", "kamamber_pishlogi", "burrata", "xalumi", "fetaksa_pishlogi", "pishloq_oaxaca_qattiq", "pishloq_queso_fresco_qattiq", "pishloq_quruq_oq_queso_seco", "pishloq_kotixa_qattiq", "qoy_pishlogi_jerebok", "qoy_suti_pishlogi_feta", "hind_paneri", "panir_hind_pishlogi"],
    "Creamy_spreadable_cheese_container": ["eritilgan_pishloq", "kokatli_eritma_pishloq", "kokatli_krem_chiz", "kokatli_pishloq", "kolbasa_pishlogi", "krem_pishloq_toliq_yogli_blok", "maskarpone", "ozbek_erigan_pishlogi", "vetchinali_eritma_pishloq", "tvorogli_eritma_pishloqcha", "vakuumdagi_pishloq_bolaklangan", "pishloq_provolone_bolaklangan", "pishloq_pasterizatsiyalangan_ishlangan_amerika_d_vitamini_bilan_boyitilgan", "pishloq_pasterizatsiyalangan_ishlangan_pishloq_mahsuloti_amerika_bir_donalik", "pishloq_amerika_restoran", "fudj_pishloq", "nok_va_yongoqli_pishloq"],
    "Creamy_yogurt_in_bowl": ["uz_yogurt", "yunon_yogurti", "yunon_yogurti_oddiy_toliq_yogli_sutdan", "yunon_yogurti_oddiy_yogsiz", "yunon_yogurti_qulupnayli_yogsiz", "asalli_grek_yogurti", "yongoqli_grek_yogurti", "klassik_yogurt", "mevali_yogurt", "rezavorli_yogurt", "tabiiy_yogurt_32", "yogurt_oddiy_toliq_yogli_sutdan", "yogurt_oddiy_yogsiz", "daxi_hind_yogurti"],
    "Farm_eggs_in_wicker_basket": ["bedana_tuxumi", "butun_tuxum_quritilgan", "butun_tuxum_xom_muzlatilgan_pasterizatsiyalangan", "glazunya_qovurilgan_tuxum", "omlet", "pashot_tuxum", "qattiq_qaynatilgan_tuxum", "skrembl_tuxum", "ordak_tuxumi", "tuxum_a_nav_katta_butun", "tuxum_a_nav_katta_oqi", "tuxum_a_nav_katta_sarigi", "tuxum_oqi", "tuxum_oqi_quritilgan", "tuxum_oqi_xom_muzlatilgan_pasterizatsiyalangan", "tuxum_sarigi", "tuxum_sarigi_quritilgan", "tuxum_sarigi_xom_muzlatilgan_pasterizatsiyalangan", "uz_tuxum", "tovuq_tuxumi", "yumshoq_qaynatilgan_tuxum"],
    "Milk_pouring_from_spoon": ["quyuqlashtirilgan_sut", "shakarsiz_quyuqlashtirilgan_sut"],
    "Ice_cream_bars_and_scoops": ["eskimo_muzqaymoq", "mevali_muzqaymoq", "plombir_muzqaymoq", "vanilli_plombir_muzqaymoq"],
    "Apples_and_quince_on_wood": ["uz_olma", "bolalar_uchun_olma_pyuresi", "olma_murabbosi", "behi_yangi", "olma_qoqi"],
    "Ripe_yellow_bananas_isolated": ["uz_banan", "bolalar_uchun_banan_pyuresi", "bananli_muzqaymoq"],
    "Citrus_fruits_whole_and_sliced": ["uz_apelsin", "uz_sok_apelsin", "apelsin_sharbati", "greypfrut", "mandarin", "uz_limon"],
    "Pomegranate_with_seeds": ["uz_anor", "anor_sharbati"],
    "Ripe_pomegranate_with_seeds": ["uz_anor", "anor_sharbati"],
    "Ripe_pears_green_yellow": ["uz_nok", "nok_komposti", "nok_sharbati", "bolalar_uchun_nok_pyuresi"],
    "Fuzzy_ripe_peaches_golden_pink": ["uz_shaftoli", "shaftoli_kompoti", "shaftoli_sharbati", "bolalar_uchun_shaftoli_pyuresi"],
    "Bowl_of_fresh_berries": ["uz_klubnika", "qulupnayli_snejok", "muzlatilgan_malina", "malina_yangi", "chernika", "maymunjon", "olcha", "qora_smorodina", "gilos"],
    "Ripe_figs,_persimmons,_plums": ["anjir_yangi", "uz_xurmo", "olxo_ri", "qoroli", "tut"],
    "Bowl_of_sun-dried_apricots": ["uz_kurage"],
    "Coconut_and_chestnut_flour_jars": ["kashtan_uni", "kokos_uni"],
    "Ripe_red_tomatoes_on_vine": ["uz_pomidor", "pomidor_roma", "pomidor_uzumsimon_xom", "pomidor_pastasi", "bolalar_uchun_sabzavotli_pyure_aralashmasi", "pomidor_sharbati_qoshimchalar_bilan_konsentratdan_javon_barqaror"],
    "Assorted_onions_dark_background": ["piyoz_oq_xom", "piyoz_qizil_xom", "piyoz_sariq_xom", "kok_piyoz", "salat_piyozi_qizil", "qovurilgan_piyoz", "yashil_piyoz_pati"],
    "Fresh_orange_carrots_with_tops": ["sabzi", "sabzi_mayda_xom", "sabzi_yetilgan_xom", "bolalar_uchun_sabzi_pyuresi", "sabzi_muzlatilgan_tayyorlanmagan", "yosh_sabzi", "dimlangan_sabzi"],
    "Eggplants_zucchinis_and_squash": ["baqlajon", "kabachok", "bolalar_uchun_kabachok_pyuresi", "yozgi_qovoq_sariq_posti_bilan_xom", "yozgi_qovoq_yashil_sukini_kabachok_posti_bilan_xom", "qovoq", "qishki_qovoq_akorn_xom", "qishki_qovoq_butternut_xom"],
    "Herbs_on_wooden_table": ["kashnich", "rayhon", "ukrop", "kok_piyoz", "jambil_ozbek_rayhoni", "ukrop_yangi", "petrushka_yangi", "shovul", "sarimsoqpiyoz_yangi", "fenxel", "fenxel_piyozcha_qismi_xom"],
    "Gourmet_mushrooms_food_photography": ["qoziqorin_buk", "qoziqorin_enoki", "qoziqorin_istridya", "qoziqorin_krimini", "qoziqorin_maytake", "qoziqorin_oq_shampinyon", "qoziqorin_pioppini", "qoziqorin_portabella", "qoziqorin_qirol_istridyasi", "qoziqorin_sher_yolasi", "qoziqorin_shiitake"],
    "Fresh_green_kale_spinach_leaves": ["keyl_xom", "keyl_muzlatilgan_pishirilgan_qaynatilgan_suvi_tokilgan_tuzsiz", "rukkola_mayda_xom", "yetilgan_ismaloq", "yosh_ismaloq", "kollard_karami_xom", "kollard_kokat", "radikkio_xom", "bargli_salat_qizil_xom", "brokkoli_rabe", "ismaloq"],
    "Root_vegetables_with_greens": ["lavlagi", "lavlagi_bargi_xom", "pasternak", "rediska", "rediska_qizil_xom", "shalgom", "sholgom_xom", "topinambur", "yashil_turp", "qora_turp", "daykon_turp", "daykon_barglari", "seldereya_ildizi", "ildiz_selderey", "pasternak_xom", "qaynatilgan_turp"],
    "Fresh_yellow_corn_on_cob": ["donador_makkajoxori", "makka_joxori_shirin_sariq_va_oq_donlari_yangi_xom", "sotali_makkajoxori", "sutli_pishganlik_makkajoxori", "makkajoxori"],
    "Fresh_green_beans_peas": ["yashil_loviya_snap_xom", "kok_noxat", "edamame", "qozoqli_loviya"],
    "Green_and_black_olives_bowl": ["zaytun_olivka", "qora_zaytun_maslina"],
    "Edible_seaweed_types_food_photog": ["laminariya_dengiz_karami", "nori_suv_otlari", "vakame"],
    "Asparagus_and_artichokes_arrange": ["artishok", "okra_bamiya", "seldereya_xom", "poreyi_piyoz", "manyok_yukka", "yams", "un_kassava", "sparja_yashil_xom", "qaynatilgan_sparja"],
    "Raw_beef_steak_on_board": ["mol_goshti_biqin_steyk_suyaksiz_sara_xom", "mol_goshti_dumba_koz_dumba_rosti_suyaksiz_faqat_yogsiz_qismi_0_yoggacha_kesilgan_tanlangan_xom", "mol_goshti_dumba_yuqori_dumba_rosti_suyaksiz_faqat_yogsiz_qismi_0_yoggacha_kesilgan_tanlangan_xom", "mol_goshti_dumba_yuqori_dumba_suyaksiz_sara_xom", "mol_goshti_korejka_vyrezka_rosti_faqat_yogsiz_qismi_suyaksiz_0_yoggacha_kesilgan_tanlangan_pishirilgan_qovurilgan", "mol_goshti_korejka_yuqori_korejka_steyk_suyaksiz_lab_bilan_faqat_yogsiz_qismi_18_yoggacha_kesilgan_sara_xom", "mol_goshti_kurak_rosti_suyaksiz_sara_xom", "mol_goshti_qisqa_korejka_ny_strip_steyk_xom", "mol_goshti_qisqa_korejka_porterxaus_steyk_faqat_yogsiz_qismi_18_yoggacha_kesilgan_tanlangan_xom", "mol_goshti_qisqa_korejka_t_suyak_steyk_suyakli_faqat_yogsiz_qismi_18_yoggacha_kesilgan_sara_pishirilgan_gril_qilingan", "mol_goshti_qiyma_80_yogsiz_20_yogli_xom", "mol_goshti_qiyma_90_yogsiz_10_yogli_xom", "mol_goshti_ribay_steyk_suyaksiz_sara_xom", "mol_goshti_vyrezka_steyk_xom", "mol_goshti_yuqori_filey_steyk_xom", "mol_boyni", "mol_kuragi", "mol_opkasi", "mol_oyogi_rulka", "mol_qovurgasi", "mol_tosh_goshti", "mol_yuragi", "buzoq_filesi", "buzoq_goshti", "qaynatilgan_mol_goshti", "mol_goshti", "uz_mol_qiyma", "mol_filesi", "steyk_200_g_porsiya", "gril_mol_goshti", "bizon_goshti_qiyma_xom"],
    "Raw_chicken_breasts,_wings,_legs": ["tovuq_broyler_yoki_fryer_kokrak_terisiz_suyaksiz_faqat_gosht_pishirilgan_dimlangan", "tovuq_broyler_yoki_fryer_oyoq_faqat_gosht_pishirilgan_dimlangan", "tovuq_filesi_kokrak_xom", "tovuq_filesi_panirovkada", "tovuq_filesi_qaynatilgan", "tovuq_gril", "tovuq_kokragi", "tovuq_kokrak_gosht_va_teri_xom", "tovuq_kokrak_suyaksiz_terisiz_xom", "tovuq_oshqozoni", "tovuq_oyogi", "tovuq_oyoq_gosht_va_teri_xom", "tovuq_qanot_gosht_va_teri_xom", "tovuq_qanoti", "tovuq_qiyma_qoshimchalar_bilan_xom", "tovuq_qiymasi", "tovuq_son_gosht_va_teri_xom", "tovuq_son_suyaksiz_terisiz_xom", "tovuq_terisi", "tovuq_yuragi", "tovuqning_toq_goshti", "sariyogli_gril_tovuq_kokragi", "tovuq_goshti", "tovuq_filesi", "tovuq_combos", "tovuq_soni", "bolalar_uchun_tovuq_pyuresi"],
    "Raw_turkey_breast_fillet": ["kurka_filesi_kokragi", "kurka_jigari", "kurka_kolbasasi", "kurka_qiyma_93_yogsiz_7_yogli_tovada_qovurilgan_bolaklar", "kurka_qiyma_93_yogsiz_7_yogli_xom", "kurka_soni", "kurka_vetchinasi", "kolbasa_kurka_nonushta_uchun_yumshoq_xom", "kurka_goshti", "kurka_kokragi", "bolalar_uchun_kurka_pyuresi"],
    "Duck_breast,_goose,_and_small": ["goz_goshti", "goz_kokragi", "ordak_kokragi", "bedana_goshti", "ordak_goshti"],
    "Pork_cuts_bacon_sausages": ["chochqa_goshti_kolbasasi", "chochqa_goshti_korejka_suyaksiz_xom", "chochqa_goshti_korejka_vyrezka_suyaksiz_xom", "chochqa_goshti_kotlet_markaziy_kesim_xom", "chochqa_goshti_qiyma_xom", "chochqa_goshti_qorin_terili_xom", "chochqa_goshti_tuzlangan_bekon_pishirilgan_restoran", "kolbasa_chochqa_goshtidan_chorizo_bolakli_yoki_qiyma_pishirilgan_tovada_qovurilgan", "kolbasa_italyan_chochqa_goshtidan_yumshoq_pishirilgan_tovada_qovurilgan", "bekon", "pepperoni"],
    "Qazi_horse_meat_sausage_Hasip": ["qaynatilgan_qazi", "qazi", "karta_ot_kolbasasi", "hasip_qoy_goshtidan_kolbasa", "ozbek_uy_kolbasasi", "kichkina_hasip", "hasip", "hasip_uy_kolbasasi", "qazi_ot_goshtidan_kolbasa"],
    "Assortment_of_sausages_and_salamis": ["qaynatilgan_kolbasa_doktorskaya", "sutli_sosiska", "sardelka", "servelat", "salyami", "krakov_kolbasasi", "moskva_kolbasasi", "odessa_kolbasasi", "shomboleho_kolbasasi", "marokash_salyamisi", "klassik_salyami", "dudlangan_kolbasa", "frankfurt_sosiskasi", "vena_sosiskasi", "choriso_gril", "kupati", "kolbasa_nonushta_kolbasasi_mol_goshtidan_oldindan_pishirilgan_tayyorlanmagan", "uz_kolbasa", "uz_sosiska", "sutli_kolbasa"],
    "Sliced_ham_and_roasted_meat": ["vetchina", "vetchina_bolakli_oldindan_oralgan_deli_gosht_96_yogsiz_suv_qoshilgan", "vetchina_bolakli_restoran", "bolaklangan_vetchina", "mol_goshti_vetchinasi", "tovuq_vetchinasi", "kurka_vetchinasi", "bujenina", "goshtli_rulet", "tovuq_ruleti"],
    "Raw_liver_tongue_kidneys": ["buzoq_jigari", "kurka_jigari", "qoy_jigari", "tovuq_jigari", "fua_gra_goz_jigari", "uz_jigar", "mol_jigari", "mol_tili", "mol_buyragi"],
    "Lean_rabbit_meat_rustic_table": ["qaynatilgan_quyon_goshti", "quyon_filesi"],
    "Meat_jelly_in_glass_dish": ["zelts_xolodets"],
    "Cutlets_schnitzels_basturma": ["mol_goshtidan_karbonad", "mol_goshtidan_kotlet", "mol_goshtidan_shnitsel", "qoy_goshtidan_kotlet", "tovuq_filesi_panirovkada", "qoy_goshtidan_basturma"],
    "Fish_sausage_garnished_lemon_dill": ["baliqli_kolbasa"],
    "Fresh_salmon_fillet_on_ice": ["losos_semga", "forel", "teriyaki_losos", "limonli_losos", "qovurilgan_losos"],
    "Red_tuna_steaks_on_plate": ["tunets", "uz_tuna", "tunets_axi_yoki_sariq_qanot_muzlatilgan_tabiiy_tutilgan"],
    "White_fish_fillets_with_peppercorns": ["sudak", "sazan", "mintay_baliq", "chortanbaliq", "baliq_atlantika_treskasi_tabiiy_tutilgan_xom", "baliq_tilapiya_fermada_ostirilgan_xom", "kambala_baliq", "tilapiya", "treska", "xek_baliq", "som_baliq", "dengiz_okuni_chili_muzlatilgan_tabiiy_tutilgan", "kefal_baliq", "maxi_maxi_baliq_muzlatilgan_tabiiy_tutilgan", "muz_baliq", "paltus_baliq", "paltus_muzlatilgan_tabiiy_tutilgan", "qilichbaliq_muzlatilgan_tabiiy_tutilgan", "snapper_baliq_muzlatilgan_tabiiy_tutilgan", "treska_tinch_okeani_yoki_alyaska_muzlatilgan_tabiiy_tutilgan", "zubatka_baliq"],
    "Shrimp_raw_or_grilled": ["krevetkalar", "gril_krevetkalari", "qaynatilgan_krevetka", "qisqichbaqasimonlar_krevetka_fermada_ostirilgan_xom"],
    "Raw_squid_rings_dark_background": ["kalmar", "kalmar_muzlatilgan_faqat_tanasi"],
    "Crab_meat_and_surimi": ["krab_goshti", "krab_tayoqchasi_surimi", "qisqichbaqasimonlar_kok_suzuvchi_krab_bolakli_pasterizatsiyalangan_sovutilgan", "qor_krabi_faqat_oyoqlari_muzlatilgan"],
    "Small_silver_fish_on_plate": ["anchous", "kilka_baliq", "sayra_baliq", "seld"],
    "Fish_roe_in_bowl": ["tuxum_ikrasi_yastik"],
    "Smoked_fish_fillet_wooden_board": ["dudlangan_treska"],
    "Seafood_products_on_ice": ["baliq_goshti", "baliq_konservasi", "dengiz_mahsulotlari_kokteyli"],
    "White_and_Devzira_rice_grains": ["uz_guruch_oq", "uz_guruch_devzira", "uz_guruch_qaynatilgan", "bolalar_guruch_botqasi"],
    "Raw_buckwheat_oats_bulgur_couscous": ["uz_grechka", "uz_ovsyanka", "uz_perlovka", "bolalar_grechka_botqasi", "bolalar_suli_botqasi", "amarant_yormasi", "arpa_yormasi_yachka", "bulgur", "kinoa", "kuskus", "manka_yormasi", "tariq_yormasi"],
    "Uzbek_bread_varieties_Patir_Obi": ["uz_non_obi", "uz_non_patir", "uz_non_oddiy", "patir", "obi_non", "g_ijduvon_noni", "jizzali_non", "lochira", "piyozli_non", "qo_qon_patiri", "samarqand_noni", "shirmoq_non", "toshkent_noni", "xorazm_noni", "zog_ora_non", "baton_non", "qora_non", "sushka_baranka"],
    "Uzbek_pastries_fried_baked_savory": ["balyish", "belyash", "bo_g_irsoq", "cheburek", "g_ilmindi", "go_shtli_non", "gumma", "qatlama", "qush_tili"],
    "Pile_of_flour_and_biscuits": ["uz_un_bugdoy", "guruch_uni", "javdar_uni", "makkajo_xori_uni", "biskvit", "pechenye", "bolalar_pechenesi"],
    "Dry_beans,_chickpeas,_mung_beans,": ["uz_loviya", "uz_no_xat", "uz_mosh", "konservalangan_loviya", "oq_loviya", "qizil_yasmiq", "qovurilgan_mosh", "sariq_no_xat", "soya_go_shti"],
    "Dry_pasta_spilling_from_bag": ["uz_makaron"],
    "Bread_crumbs_in_bowl": ["non_tarixi", "non_ushoqlari"],
    "Chocolate_pieces_with_gold_foil": ["uz_shokolad_qora", "uz_shokolad_molok", "oq_shokolad"],
    "Golden_honey_in_jar": ["uz_asal", "asal"],
    "Ice_cream_bars_and_scoops": ["uz_morojenoe", "bananli_muzqaymoq", "karamelli_muzqaymoq", "pistali_muzqaymoq", "shokoladli_muzqaymoq"], # Overlap with dairy?
    "Layered_chocolate_cake_on_plate": ["paxlava", "ekler", "brauni_shokoladli", "tiramisu", "keks_shokoladli"],
    "Glass_cup_of_hot_tea": ["uz_choy_qora", "uz_choy_kok", "kok_choy_damlangan", "qora_choy_damlangan", "sutli_choy_ozb", "asalli_choy", "joka_choy", "karkade_gibiskus_choy", "limon_choy", "masala_choy", "matcha_choyi", "mattya_latte", "moychechak_choy", "namatak_choy", "oliy_navli_ulun_choyi", "puer_choy", "quralin_choyi_ozb", "roybush_choy", "yalpiz_choy", "yasmin_gulli_kok_choy", "zanjabil_choy"],
    # Professional_food_photography_of_a - let's see which ones.
    "Cold_glass_mineral_water_ice": ["uz_suv", "gazlangan_suv", "gazsiz_suv", "mineral_suv", "buloq_suvi", "asnov_suvi", "kam_gazlangan_suv", "kuchli_gazlangan_suv", "kupkop_mineral_suvi", "tozalangan_suv"],
    "Juices_in_tall_glasses": ["ananas_sharbati", "anor_sharbati", "apelsin_sharbati", "uz_sok_apelsin", "gilos_sharbati", "karam_sharbati", "kivi_sharbati", "klyukva_sharbati", "lavlagi_sharbati_1", "mango_sharbati", "olcha_sharbati", "olma_sharbati", "olxori_sharbati", "orik_sharbati", "ozbek_shaftoli_sharbati", "pomidor_sharbati", "qayin_sharbati", "sabzi_sharbati", "selderey_sharbati", "uzum_sharbati", "yotal_sharbati"],
    "Cold_soda_with_ice": ["coca_cola", "pepsi", "fanta", "lemonade", "dietik_kola", "limonad", "tonik", "uy_limonadi"],
    "Kvas_and_grain_drinks": ["kvas", "kam_alkogolli_kvas", "olma_kvasi", "olmali_kvas", "tarasiy_kvasi", "buza_tariqdan_tayyorlangan_ozbek_ichimligi"],
    "Smoothie_in_glass_jar_ingredients": ["banan_qulupnay_smuzi", "bananli_smuzi", "rezavor_mevali_smuzi", "shokoladli_smuzi", "yashil_smuzi_ismaloq", "yashil_smuzi_sabzavotli", "kokos_suvi"],
    "Refreshing_white_savory_yogurt_drinks": ["ayron", "toshkent_ayroni", "tan"],
    "Wines_beers_spirits_photography": ["aroq_40", "desert_qizil_vino", "jin", "konyak", "likyor", "muskat", "och_rangli_pivo", "pivo_yorug_45", "qrim_vinosi", "quruq_oq_vino", "quruq_qizil_vino", "quyuq_pivo", "rom", "shampan_vinosi", "sidr", "tekila", "uy_oq_vinosi", "uy_qizil_vinosi", "viski", "yarim_shirin_vino", "alkogolsiz_pivo", "filtrlanmagan_pivo"],
    "Energy_drink_can_and_glass": ["adrenaline_rush", "red_bull", "izotonik_ichimlik"],
    "Protein_shake_in_shaker": ["uz_whey_shokolad", "uz_whey_vanil", "oqsil_zardobi_whey", "kazein_protein", "soya_oqsili", "osimlik_oqsili", "sarum_oqsili_whey", "tuxum_oqsili"],
    "White_powder_in_tubs": ["uz_bcaa", "uz_creatine", "l_karnitin", "bcaa_aminokislotalar", "geyner", "uz_gainer", "mashgulotdan_oldingi_kompleks"],
    "Green_powders_or_collagen_shots": ["kollagen", "spirulina", "xlorella_kukun"],
    "Protein_bar_showing_texture": ["uz_protein_bar", "fitnes_batonchigi"],
    "Golden_oil_in_glass_bottles": ["uz_zayt_yog", "uz_kungaboqar_yog", "paxta_yogi", "raps_yogi", "soya_yogi", "makka_joxori_yogi", "argan_yogi", "avokado_yogi", "amarant_yogi", "findiq_yogi", "koknori_yogi", "kunjut_yogi", "uzum_urugi_yogi", "zigir_yogi"],
    "Yellow_butter_on_ceramic_dish": ["uz_sariyog", "sariyog_825", "bayram_sariyogi", "margarin"],
    "Golden_liquid_ghee_jar": ["eritilgan_sariyog_gxi", "gi_moyi"],
    "Coconut_oil_in_jar": ["kokos_yogi"],
    "Rendered_fats_and_traditional_Dumba": ["dumba_yogi", "dumba_qovurilgan", "salo_chochqa_yogi", "smalets_chochqa_yogi", "baliq_yogi"],
    "Fine_white_sea_salt_bowl": ["uz_tuz", "osh_tuzi", "tuz_oshxona_yodlangan"],
    "Sugar_crystals_spilling_dark_sur": ["shakar_qum", "jigarrang_shakar", "uz_shakar"],
    "Tomato_sauce_or_adjika_bowl": ["ketchup", "adjika", "pomidor_pastasi", "pomidorli_salsa", "salsa", "sos_salsa_istemolga_tayyor", "tkemali_olxori_sousi", "xrenovina_pomidorxrensarimsoq"],
    "Mayonnaise_béchamel_in_bowl": ["provansal_mayonezi", "yengil_mayonez_30", "beshamel_sousi", "chakka"],
    "Dark_sauces_and_vinegars": ["soya_sosi", "teriyaki_sousi", "vusterskiy_sous", "balzamik_sirka", "guruch_sirkasi", "malina_sirkasi", "olma_sirkasi", "oshxona_sirkasi_9", "uzum_sirkasi"],
    "Yellow_and_green_condiments_dish": ["xantal", "tayyor_sariq_xantal", "xantal_kukuni", "stol_xreni", "xren_otquloq", "vasabi"],
    "Pesto_and_guacamole_bowl": ["pesto_sousi", "guakamole_sousi", "satsivi"],
    "Compressed_seasoning_cubes": ["mol_goshtli_bulyon_kubigi", "tovuq_bulyon_kubigi", "sabzavotli_bulyon_kubigi"],
    "Large_gourmet_burger_sandwich": ["baliqli_burger", "uz_sendvich"],
    "Pizza_slice_with_stretching_cheese": ["lososli_pitsa", "yupqa_pitsa", "pitsa"],
    "Salads_with_vegetables_and_protein": ["achchiq_chuchuk_shakarob", "bahor_salati", "baqlajon_salat", "kinoali_salat", "koreyscha_sabzi", "krevetka_va_avokadoli_salat", "krevetkali_salat", "lavlagi_salati", "marg_ilon_turpi_salati", "sabzi_salat_marko_vcha", "avokadoli_salat", "romen_salati", "romen_salati_yashil_xom", "sabzavot_assortisi"],
    "Uzbek_cooked_dishes_steaming": ["beshbarmoq", "bifshteks_o_zbekcha", "bug_lama", "chuchvara_qaynatma", "chuchvara_qovurma", "chuchvara_tabaqa", "dimlangan_mol_goshti_tushyonka", "dimlangan_qoy_goshti", "jiz", "jo_ja_tabaka", "kalla_pocha", "manpar", "piyova", "uz_qovurdoq", "xonim_go_shtli", "xonim_qovoqli", "xiva_baragi", "suv_barak", "qovurma_barak", "uz_moshxurda", "yaxna_go_sht", "zirvak", "beshbarmoq_gosht_va_xamir_bilan", "shavla_goshtli_guruch_botqasi"],
    "Spaghetti_Bolognese_with_basil": ["lazanya", "spagetti_bolonez", "spagetti_karbonara", "vena_usulida_shnitsel", "tuxumli_pasta", "shakshuka", "shchi", "yasmiq_shorvasi", "frikadelkali_shorva", "lososli_shorvasi", "karri_umumiy", "chili_kon_karne", "chapchxe"],
    "Fresh_sushi_rolls_on_slate": ["avokadoli_maki", "tunetsli_maki"],
    "Assortment_of_gourmet_nuts": ["uz_orex_gretski", "uz_mindal", "uz_funduk", "uz_fistashki", "uz_arahis", "keshyu", "makadamiya", "pekan_yong_og_i", "kedr_yong_og_i", "braziliya_yong_og_i", "asalli_yong_oq", "urbech"],
    "Seeds_in_glass_jars": ["kungaboqar_urug_i", "qovoq_urug_i", "kunjut_urug_i", "zig_ir_urug_i", "chia_urug_i"],
    "Baby_cereal_in_bowl": ["bolalar_uchun_7_don_botqasi", "bolalar_uchun_bugdoy_botqasi", "bolalar_uchun_makkajoxori_botqasi", "bolalar_uchun_nan_aralashmasi", "sutli_aralashma_1", "sutli_aralashma_2"],
    "Orange_puree_in_glass_jar": ["bolalar_uchun_mango_pyuresi", "bolalar_uchun_orik_pyuresi", "bolalar_uchun_qovoq_pyuresi", "bolalar_uchun_mevali_pyure_aralashmasi"],
    "Ingredients_and_pantry_staples": ["konservalangan_ko_k_no_xat", "konservalangan_makkajo_xori", "tomatli_sousda_loviya", "pomidor_butun_konservalangan_qattiq_va_suyuq_qismlari_tuz_qoshilgan", "pomidor_ezilgan_konservalangan", "pomidor_konservalangan_qizil_pishgan_kubiklarga_kesilgan", "shprot_yog_da", "marinadlangan_daykon_turpi", "marinadlangan_piyoz", "tuzlangan_bodring", "tuzlangan_pomidor", "kraxmal", "jelatin", "pishiriq_sodasi", "xamirturush_quruq", "kakao_kukuni"],
    "Juicy_oranges": ["uz_apelsin", "uz_sok_apelsin", "apelsin_sharbati", "greypfrut", "mandarin", "uz_limon"],
    "Raw_potatoes": ["kartoshka", "batat_shirin_kartoshka", "shirin_kartoshka_toq_sariq_etli_terisiz_xom", "anna_kartoshka", "bolalar_uchun_mol_goshti_pyuresi", "posti_bilan_kartoshka", "kartoshka_qizil_terisiz_xom", "kartoshka_russet_terisiz_xom", "kartoshka_sariq_terisiz_xom", "un_kartoshka"],
    "Watermelon_and_melon": ["uz_tarvuz", "uz_qovun"],
    "Professional_food_photography_of_fresh": ["uz_olma", "bolalar_uchun_olma_pyuresi", "olma_murabbosi", "behi_yangi", "olma_qoqi"],
}

# Add more specific mappings if needed
# "Professional_food_photography_of_a" might be coffee or something else.
# Let's check "Professional_food_photography_of_a_202605042137.jpeg"
# Wait, I don't know what these are. I'll just skip them or name them generic if I can guess.
# Actually, I'll check the list again.

# "Professional_food_photography_of_a_202605042137.jpeg"
# "Professional_food_photography_of_a_202605042137_2.jpeg"
# "Professional_food_photography_of_a_202605042137_3.jpeg"
# "Professional_food_photography_of_an_202605042137.jpeg"
# "Professional_food_photography_of_fresh_202605042137.jpeg"

# Looking at the prompts in the md file:
# 155: Professional food photography of a cup of hot coffee...
# 171: Professional food photography of a matte black fitness shaker... (Protein_shake_in_shaker covers this)
# 174: Professional food photography of a half-eaten protein bar... (Protein_bar_showing_texture covers this)
# 146: Professional food photography of a slice of layered chocolate cake... (Layered_chocolate_cake_on_plate covers this)
# 145: Professional food photography of a perfect scoop of vanilla and chocolate ice cream... (Ice_cream_bars_and_scoops covers this)

# Maybe the "Professional_food_photography_of_a" is coffee.
mapping["Professional_food_photography_of_a"] = ["uz_kofe", "amerikano", "kapuchino", "latte", "espresso", "frappe", "3_in_1_qahva", "eriydigan_qora_qahva", "glyase", "makiato", "mokko", "shakarsiz_qora_qahva", "sublimatsiyalangan_eriydigan_qahva", "tortilgan_arabika_qahvasi", "tortilgan_robusta_qahvasi"]

files = os.listdir(src_dir)
count = 0

for filename in files:
    if not filename.endswith(".jpeg"):
        continue
    
    # Extract the base part (before timestamp)
    base_name = re.sub(r"_\d{12}(_\d+)?\.jpeg$", "", filename)
    
    matched_slugs = None
    for key, slugs in mapping.items():
        if key in base_name:
            matched_slugs = slugs
            break
    
    if matched_slugs:
        for slug in matched_slugs:
            dest_file = os.path.join(dest_dir, f"{slug}.png")
            # We use .png as requested, though it's actually jpeg. Most viewers handle this.
            shutil.copy(os.path.join(src_dir, filename), dest_file)
            count += 1
    else:
        print(f"No mapping found for: {filename} (base: {base_name})")

print(f"Successfully processed {count} images.")
