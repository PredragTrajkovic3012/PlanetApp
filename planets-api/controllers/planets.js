const { storeImage, deleteImage } = require("../storageApi");
const {
  addPlanet,
  updatePlanet,
  reloadPlanets,
  getPlanet,
  deletePlanet,
  getPlanets,
  getImage,
  planetExists,
} = require("../data/planetsRepository");

exports.postAddPlanet = (req, res) => {
  let planetData = req.body;
  let file = req.file;

  if (planetData.distInMillionsKM && typeof planetData.distInMillionsKM === "string") {
    try {
      planetData.distInMillionsKM = JSON.parse(planetData.distInMillionsKM);
    } catch (e) {
      console.error("Error while parsing distInMillionsKM:", e);
    }
  }

  if (file) {
    fileName = getNewFileName(file);

    storeImage(file, fileName)
      .then((imageUrl) => {
        planetData.imageUrl = imageUrl;
        planetData.imageName = fileName;
        addPlanet(planetData);
        res.status(200).send(planetData);
      })
      .catch((errorKey) => {
        res.status(500).send(errorKey);
      });
  } else {
    addPlanet(planetData);
    res.status(200).send(planetData);
  }
};

exports.putUpdatePlanet = (req, res) => {
  const planetData = req.body;
  const planetId = req.params["id"];
  let file = req.file;

  let canUpdate = planetExists(planetId);
  if (planetData.distInMillionsKM && typeof planetData.distInMillionsKM === "string") {
    try {
      planetData.distInMillionsKM = JSON.parse(planetData.distInMillionsKM);
    } catch (e) {
      console.error("Error while parsing distInMillionsKM:", e);
    }
  }

  if (canUpdate) {
    if (file) {
      deleteImage(getImage(planetId));
      fileName = getNewFileName(file);
      storeImage(file, fileName)
        .then((imageUrl) => {
          planetData.imageUrl = imageUrl;
          planetData.imageName = fileName;
          planetData.id = +planetId;
          updatePlanet(planetId, planetData);
          res.status(200).send(planetData);
        })
        .catch((errorKey) => {
          res.status(500).send(errorKey);
        });
    } else {
      updatePlanet(planetId, planetData);
      planetData.id = +planetId;
      res.status(200).send(planetData);
    }
  } else {
    res.status(204).send();
  }
};

exports.getPlanet = (req, res) => {
  const planetId = req.params["id"];
  let planet = getPlanet(planetId);
  if (planet !== undefined) {
    return res.status(200).send(planet);
  }

  res.status(204).send();
};

exports.deletePlanet = async (req, res) => {
  const planetId = req.params["id"];

  // Not waiting for image to be deleted, deleteImage logs the name in case of failiure
  deleteImage(getImage(planetId));

  planetDeleted = deletePlanet(planetId);

  if (planetDeleted) {
    return res.status(200).send(planetDeleted);
  }

  res.status(204).send(planetDeleted);
};

exports.getPlanets = (_, res) => {
  res.send(getPlanets());
};

exports.getReloadPlanets = (_, res) => {
  reloadPlanets((planets) => res.send(planets));
};

exports.loadData = () => reloadPlanets(() => console.log("Data initialized."));

const getNewFileName = (file) => `${Date.now()}_${file.originalname}`;
