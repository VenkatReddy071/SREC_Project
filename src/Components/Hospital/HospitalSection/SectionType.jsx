import React from 'react';
import { useLocation } from 'react-router-dom';
import { Hospital } from '../ShowCaseSection/Hospital';
const HospitalShowcase = () => <Hospital/>;
const RestaurantShowcase = () => <div>Restaurant Showcase</div>;
const MallShowcase = () => <div>Mall Showcase</div>;
const SchoolShowcase = () => <div>School Showcase</div>;
const CollegeShowcase = () => <div>College Showcase</div>;

export const SectionType = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type1 = searchParams.get('type');
  const [type] = type1 ? type1.split("/") : [null];

  let ComponentToRender = null;
  switch (type) {
    case "hospital":
      ComponentToRender = HospitalShowcase;
      break;
    case "restaurant":
      ComponentToRender = RestaurantShowcase;
      break;
    case "mall":
      ComponentToRender = MallShowcase;
      break;
    case "school":
      ComponentToRender = SchoolShowcase;
      break;
    case "college":
      ComponentToRender = CollegeShowcase;
      break;
    default:
      ComponentToRender = () => <div>Type not recognized</div>;
  }

  return (
    <div>
      {ComponentToRender && <ComponentToRender />}
    </div>
  );
};
