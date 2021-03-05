# Semestrální práce - Textová adventura
## Jaroslav Erben


### Zadání:
Textová adventura ve stylu Zork. Uživatel dostane popis situace a zadáváním 
příkazů interaguje s prostředím. Pohyb po světových stranách - grid-based. 
Možné rozšíření: uživatel si může vytvářet mapu světa (vyplňování poznámek do čtevečkové mapy).   

Technologie:
* HTLM 
* CSS 
* JS

*Pozn.: možné rozšíření, tedy mapa pro poznámky, nebylo implementováno*

### Postup
Jádrem aplikace je generování světa, NPC a vyhodnocování příkazů uživatele.
Generování je řešeno vytvořením místnosti uprostřed gridu a následně náhodného 
pohybu po něm. Pokud je políčko volné vytvoří se nová místnot. Pohyb a tvorba místnosti 
se opakuje dokud se nevytvoří požadovaný počet.

Každé NPC, předmět a prostředí má vlastní strategii vycházející z příslušného 'interface'.

Příkazy jsou vyhodnocovány pomocí třídy Command, která přijme řetězec příkazu a 
následně porovnává s přípustnými příkazy. Při validní syntaxi přepíše funkci act(), 
která po zavolání provede požadované změny v herním světě. 


### Funkčnost
Aplikace je responsivní a nabízí volitelné ovládací prvky pro usnadnění ovládání 
na dotykových displejích. 

Je možné přepínat mezi tmavým a světlým stylem stránky, kde 
poslední vybraná varianta je uložena v localStorage a při následujícím načtení nastavena.

Celá aplikace je v anglickém jazyce.

### Návod
Při spuštění stránky se automaticky spustí nová hra na nízkou obtížnost. 
Změna obtížnosti se projeví až při další hře. 

Cílem hry je získaní daného počtu zlata. Hráč prohrává pokud mu dojdou životy.

Hra se ovládá textovými příkazy, které je možné přímo psát nebo využít nabídku 
příkazů, která se zobrazí po zapnutí "Touch control aid". Přípustné příkazy jsou 
pouze v angličtině a pouze v následující syntaxy 

 `<akce> [předložka/světová strana/předmět/NPC] [předmět] [předložka] [NPC]`

Př:
* GIVE GOLD TO WOLF
* INVENTORY
* HIT BANDIT
* TALK TO SHOPKEEPER
* ...

|   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|
| **AKCE** | MOVE| PICK | USE | TALK | GIVE | HIT | LOOK | INVENTORY|
| **PŘEDLOŽKY** | UP | TO |
| **PŘEDMĚTY** | GOLD | POTION | SWORD | KEY |
| **NPC** | WOLF | BANDIT | SHOPKEEPER | TRAVELER | MONK|  
| **S. STRANA** | NORTH | EAST | SOUTH | WEST |