export interface Planet {
  id: number;
  planetName: string;
  planetColor: string;
  planetRadiusKM: number;
  distInMillionsKM: Distance;
  description: string;
  imageUrl: string;
  imageName: string;
}

export interface Distance {
  fromSun: number;
  fromEarth: number;
}
