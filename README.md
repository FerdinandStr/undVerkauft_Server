# und Verkauft! Backend

## Grundlagen

Das Backend besteht aus einer "nackten" **MongoDB** ohne jegliche Anpassungen und einem **nodeJS** Server, der direkt auf diese zugreift (ohne Passwort)

Somit kann theoretisch eine MongoDB Datenbank gestartet werden (localhost:27017) und der nodeJS Server wird sich dann automatisch beim start verbinden und die "undverkauft_db" Datenbank anlegen

_Da dies jedoch nur der Fallback ist, sollte das ganze mit **Docker** gestartet werden_

# Setup

## Docker (bevorzugt)

Das komplette Backed sollte mit einem einzigen docker-compose Script automatisch starten, hierzu muss lokal **Docker installiert** sein und dann folgender Befehl ausgeführt werden:

> _terminal im Backend root Verzeichnis geöffnet_

> docker-compose up

Damit sollte das Image des **NodeJS Server** gebaut und als Container gestartet werden.
Außerdem wird automatisch ein **MongoDB** Image heruntergeladen und auch in einem Container gestartet.
Diese beiden Container sollten dann miteinander kommunizieren und das Backend somit unter [localhost:3000](http://localhost:3000/) erreichbar sein

## Manuelles Setup

Es kann wie oben kurz erwähnt auch jeder andere MongoDB Server verwendet werden, der im Netzwerk erreichbar ist. Hierzu muss in der **.env** Datei lediglich die MongoDB URL angepasst werden.
Danach kann der Webserver von Hand gestartet werden, hierzu folgende Befehle ausführen:

> _lokalen/Netzwerk MongoDB Server starten und .env Datei anpassen_

> _terminal im Backend root Verzeichnis geöffnet_

> npm install

> npm run start
