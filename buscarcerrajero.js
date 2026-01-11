    function cerrarModal() {
      document.getElementById("modal").style.display = "none";
    }

    async function buscarPorUbicacion() {
      if (!navigator.geolocation) {
        alert("Tu navegador no permite geolocalización.");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        const umbral = parseFloat(document.getElementById("umbral-km").value) || 50;

        let data;
        try {
          const res = await fetch("disponibles.json");
          data = await res.json();
        } catch (e) {
          alert("Error cargando zonas disponibles.");
          return;
        }

        const barrios = data.filter(d => d.barrio);
        const localidades = data.filter(d => d.localidad && !d.barrio);
        const provincias = data.filter(d => d.provincia && !d.localidad);

        let mejorBarrio = buscarMasCercano(barrios, userLat, userLon, umbral);
        if (mejorBarrio) return mostrarModal(mejorBarrio, "Barrio cercano con servicio:");

        let mejorGrupoBarrio = buscarMasCercanoAgrupado(barrios, 'provincia', 'localidad', userLat, userLon, umbral);
        if (mejorGrupoBarrio) return mostrarModal(mejorGrupoBarrio, "Barrio en tu localidad con servicio:");

        let mejorLocalidad = buscarMasCercano(localidades, userLat, userLon, umbral);
        if (mejorLocalidad) return mostrarModal(mejorLocalidad, "Localidad cercana con servicio:");

        let provinciaCercana = buscarMasCercano(provincias, userLat, userLon, umbral);
        if (provinciaCercana) return mostrarModal(provinciaCercana, "Servicio a nivel provincial:");

        alert("⚠️ No hay cerrajeros disponibles en tu zona aún.");
      }, () => {
        alert("No se pudo obtener tu ubicación.");
      });
    }

    function buscarMasCercano(lista, lat, lon, umbral) {
      if (!lista.length) return null;
      let mejor = null;
      let minDist = Infinity;
      for (let item of lista) {
        const dist = haversine(lat, lon, item.lat, item.lon);
        if (dist < minDist) {
          minDist = dist;
          mejor = item;
          mejor.dist = dist;
        }
      }
      return mejor && mejor.dist <= umbral ? mejor : null;
    }

    function buscarMasCercanoAgrupado(lista, nivel1, nivel2, lat, lon, umbral) {
      const agrupado = {};
      for (let item of lista) {
        const clave = `${item[nivel1]}-${item[nivel2]}`;
        if (!agrupado[clave]) agrupado[clave] = [];
        agrupado[clave].push(item);
      }

      let mejor = null;
      let minDist = Infinity;

      for (let key in agrupado) {
        const grupo = agrupado[key];
        const centroide = promedioCoords(grupo);
        const dist = haversine(lat, lon, centroide.lat, centroide.lon);
        if (dist < minDist) {
          mejor = grupo[0];
          mejor.dist = dist;
          minDist = dist;
        }
      }

      return mejor && mejor.dist <= umbral ? mejor : null;
    }

    function promedioCoords(lista) {
      const sum = lista.reduce((acc, i) => {
        acc.lat += i.lat;
        acc.lon += i.lon;
        return acc;
      }, { lat: 0, lon: 0 });
      return { lat: sum.lat / lista.length, lon: sum.lon / lista.length };
    }

    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const toRad = x => x * Math.PI / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function mostrarModal(zona, titulo) {
      const modal = document.getElementById("modal");
      const cont = document.getElementById("modal-contenido");

      cont.innerHTML = `
        <h2>${titulo}</h2>
        <p><strong>Zona:</strong> ${zona.barrio || zona.localidad || zona.provincia}</p>
        <p><strong>Distancia:</strong> ${zona.dist?.toFixed(2)} km</p>
        <p><a href="${zona.url}" target="_blank" class="button">🔗 Ir al sitio</a></p>
        <button onclick="cerrarModal()" class="button">Cerrar</button>
      `;
      modal.style.display = "block";
    }
  