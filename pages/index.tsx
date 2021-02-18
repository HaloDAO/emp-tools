import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Container,
  Box,
  Typography,
  Tab,
  Tabs,
  Hidden,
  Button,
  Menu,
  MenuItem,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import Header from "../features/core/Header";
import ContractState from "../features/contract-state/ContractState";
import ManagePosition from "../features/manage-position/ManagePosition";
import EmpSelector from "../features/emp-selector/EmpSelector";
import AllPositions from "../features/all-positions/AllPositions";
import Weth from "../features/weth/Weth";
import Yield from "../features/yield/Yield";
import Analytics from "../features/analytics/Analytics";

import EmpAddress from "../containers/EmpAddress";
import Collateral from "../containers/Collateral";
import Token from "../containers/Token";
import WethContract from "../containers/WethContract";
import Connection from "../containers/Connection";

import { YIELD_TOKENS } from "../constants/yieldTokens";

import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";

const StyledTabs = styled(Tabs)`
  & .MuiTabs-flexContainer {
    border-bottom: 1px solid #999;
    width: 200%;
  }
  & .Mui-selected {
    font-weight: bold;
  }
  padding-bottom: 2rem;
`;

const Blurb = styled.div`
  padding: 1rem;
  border: 1px solid #434343;
`;

export default function Index() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>(
    "General Info"
  );
  const [options, setOptions] = useState<Array<string>>([]);
  const { address: collAddress } = Collateral.useContainer();
  const { address: tokenAddress } = Token.useContainer();
  const { contract: weth } = WethContract.useContainer();
  const { empAddress } = EmpAddress.useContainer();
  const { signer, network } = Connection.useContainer();

  const isYieldToken =
    tokenAddress &&
    Object.keys(YIELD_TOKENS).includes(tokenAddress.toLowerCase());

  const buildOptionsList = () => {
    // Default list that all contracts have.
    //let menuOptions = ["General Info", "Manage Position", "All Positions"];
    let menuOptions = ["General Info", "Manage Position"];
    // If it is weth collateral contract then add the weth option.
    if (weth && collAddress?.toLowerCase() == weth.address.toLowerCase()) {
      menuOptions.push("Wrap/Unwrap WETH");
    }

    // If it is a yield token then add the yUSD yield and analytics tabs.
    if (isYieldToken) {
      menuOptions = menuOptions.concat(["yUSD Yield", "Analytics"]);
    }

    // Update selected page if the user toggles between EMPs while selected on
    // invalid pages (i.e on Wrap/Unwrap then moves to uUSDrBTC).
    if (menuOptions.indexOf(selectedMenuItem) == -1) {
      setSelectedMenuItem("General Info");
    }
    return menuOptions;
  };

  useEffect(() => {
    setOptions(buildOptionsList());
  }, [empAddress, weth, collAddress, isYieldToken, selectedMenuItem]);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (index: number) => {
    setAnchorEl(null);
    setSelectedMenuItem(options[index]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth={"md"}>
      <Box py={4}>
        <Header />
        <EmpSelector />
        {signer && network && (
          <Box mt={3}>
            <Hidden only={["sm", "xs"]}>
              <StyledTabs
                value={options.indexOf(selectedMenuItem)}
                onChange={(_, index) => handleMenuItemClick(index)}
              >
                {options.map((option, index) => (
                  <Tab key={index} label={option} disableRipple />
                ))}
              </StyledTabs>
            </Hidden>
            <Hidden only={["md", "lg", "xl"]}>
              <div>
                <Box pt={1} pb={2}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button variant="outlined" onClick={handleClickListItem}>
                        <MenuIcon />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Typography style={{ marginTop: `8px` }}>
                        <strong>Current page:</strong> {selectedMenuItem}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === options.indexOf(selectedMenuItem)}
                      onClick={(_) => handleMenuItemClick(index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </Hidden>
            {selectedMenuItem === "General Info" && <ContractState />}
            {selectedMenuItem === "Manage Position" && <ManagePosition />}
            {selectedMenuItem === "All Positions" && <AllPositions />}
            {selectedMenuItem === "yUSD Yield" && <Yield />}
            {selectedMenuItem === "Wrap/Unwrap WETH" && <Weth />}
            {selectedMenuItem === "Analytics" && <Analytics />}
          </Box>
        )}
      </Box>
      <Box py={4} textAlign="center">
        Alpha version (Kovan). Built on UMA.
      </Box>
    </Container>
  );
}
